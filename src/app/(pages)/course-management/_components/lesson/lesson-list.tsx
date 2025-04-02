import { useEffect, useState } from "react";
import { ArrowDown01, ArrowUp01, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CirclePlus, LoaderCircle, } from "lucide-react";
import { toast } from "sonner";

import { getLessonsByStudyPlanId } from "@/app/api/lesson/lesson.api";
import { LessonList } from "@/types/lesson";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyStateComponent from "@/components/empty-state";
import LessonPopupForm from "./create-lesson-pop-up";
import { LessonResource } from "@/types/lesson-resource";
import { getLessonResourceByLessonId } from "@/app/api/lesson-resource/lesson-resource.api";
import LessonItem from "./lesson-item";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";


interface LessonListProps {
    studyPlanId: number;
    isDefaultStudyPlan: boolean;
    token: string;
}

const LessonListComponent = ({ studyPlanId, token, isDefaultStudyPlan }: LessonListProps) => {
    const [lessonList, setLessonList] = useState<LessonList>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingLR, setIsLoadingLR] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [sortDir, setSortDir] = useState<string>("asc");
    const [searchValue, setSearchValue] = useState<string>("");

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

    const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
    const [lessonResources, setLessonResources] = useState<Record<number, LessonResource[]>>({});
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");


    const fetchLessons = async () => {
        try {
            setIsLoading(true);
            const lessonsData = await getLessonsByStudyPlanId({
                token,
                studyPlanId,
                pageNo: currentPage,
                pageSize: 10,
                sortBy: "lessonOrder",
                sortDir,
                keyword: searchValue
            });
            setLessonList(lessonsData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load lessons.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [sortDir, debouncedSearchValue, currentPage]);

    const handleSortChange = () => {
        setSortDir(prevSortDir => (prevSortDir === "asc" ? "desc" : "asc"));
        setCurrentPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);

        // Hủy bỏ timeout cũ (nếu có)
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Thiết lập timeout mới
        const id = setTimeout(() => {
            setCurrentPage(0)
            setDebouncedSearchValue(event.target.value);
        }, 500); // 500ms delay

        setTimeoutId(id); // Lưu lại timeoutID để có thể hủy sau
    };

    const toggleLessonResource = async (lessonId: number) => {
        if (expandedLessonId === lessonId) {
            setExpandedLessonId(null); // Đóng danh sách nếu đang mở
            return;
        }

        setExpandedLessonId(lessonId);

        // Kiểm tra nếu đã có dữ liệu thì không gọi API nữa
        if (lessonResources[lessonId]) return;

        setIsLoadingLR(true);

        try {
            const resources = await getLessonResourceByLessonId(token, lessonId);
            setLessonResources(prev => ({
                ...prev,
                [lessonId]: Array.isArray(resources) ? resources : [] // Đảm bảo luôn là mảng
            }));
            if (resources === null) {
                console.warn(`Lesson ${lessonId} has no resources.`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load lesson resource.");
            setLessonResources(prev => ({
                ...prev,
                [lessonId]: [] // Tránh lỗi .map()
            }));
        } finally {
            setIsLoadingLR(false);
        }
    };

    const updateLessonResources = (lessonId: number, resourceId: number) => {
        setLessonResources(prev => {
            const updatedResources = prev[lessonId]
                .filter(resource => resource.lessonResourceId !== resourceId)
                .map((resource, index) => ({
                    ...resource,
                    typeOrder: index + 1,
                }));

            return {
                ...prev,
                [lessonId]: updatedResources,
            };
        });
    };


    const handleNextPage = () => {
        if (lessonList?.last) {
            return
        }
        setCurrentPage(currentPage + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage === 0) {
            return
        }
        setCurrentPage(currentPage - 1)
    }

    const handleLastPage = () => {
        if (lessonList?.last) {
            return
        }
        if (lessonList?.totalPages)
            setCurrentPage(lessonList?.totalPages - 1)
    }
    const handleFirstPage = () => {
        if (currentPage === 0) {
            return
        }
        setCurrentPage(0)
    }

    return (
        <>
            <div className="w-full flex justify-between">
                <div className="text-4xl font-bold flex items-center">
                    Lessons in study plan ({isLoading ? <LoaderCircle className="animate-spin" /> : lessonList?.totalElements})
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                        <CirclePlus />Create new lesson
                    </DialogTrigger>
                    <DialogContent width='400px'>
                        <LessonPopupForm
                            initialData={null}
                            setIsDialogOpen={setIsCreateDialogOpen}
                            fetchLessons={fetchLessons}
                            studyPlanId={studyPlanId}
                            lessonId={null}
                            initialOrder={null}
                            token={token}
                        />
                    </DialogContent>
                </Dialog>

            </div>
            <div className="w-full space-y-5">
                <div className="flex flex-row space-x-10 items-center">
                    <Input
                        className="w-[300px]"
                        placeholder="Search name"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <div className="space-x-2 flex flex-row items-center">
                        <span className="font-semibold">Lesson order:</span>
                        <Button size={"icon"} variant={"outline"} onClick={handleSortChange}>
                            {sortDir === "asc" ? <ArrowDown01 /> : <ArrowUp01 />}
                        </Button>
                    </div>
                </div>
                {isLoading ?
                    <Skeleton className="w-full h-[500px]" />
                    :
                    <div className="w-full min-h-[500px] bg-[#F5F5F5] p-[10px] rounded-2xl space-y-5">
                        {lessonList?.content.length ? (
                            lessonList.content.map((lesson) => (
                                <LessonItem
                                    key={lesson.lessonId}
                                    lesson={lesson}
                                    lessonResources={lessonResources}
                                    expandedLessonId={expandedLessonId}
                                    isLoadingLR={isLoadingLR}
                                    toggleLessonResource={toggleLessonResource}
                                    fetchLessons={fetchLessons}
                                    isDefaultStudyPlan={isDefaultStudyPlan}
                                    token={token}
                                    updateLessonResources={updateLessonResources}
                                    setLessonResources={setLessonResources}
                                    studyPlanId={studyPlanId}
                                />
                            ))
                        ) : (
                            <EmptyStateComponent
                                message={searchValue
                                    ? "No results found"
                                    : "This study plan does not have any lessons"}
                                size={400}
                                imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp" />
                        )}
                    </div>
                }
                <Pagination className="space-x-6">
                    <PaginationContent>
                        <PaginationItem >
                            <Button disabled={currentPage === 0} onClick={handleFirstPage} variant={"ghost"}><ChevronsLeft /></Button>
                        </PaginationItem>
                        <PaginationItem >
                            <Button disabled={currentPage === 0} onClick={handlePreviousPage} variant={"ghost"}><ChevronLeft /></Button>
                        </PaginationItem>
                        <PaginationItem>
                            {currentPage + 1}/{lessonList?.totalPages}
                        </PaginationItem>
                        <PaginationItem onClick={handleNextPage}>
                            <Button disabled={lessonList?.last === true} onClick={handleNextPage} variant={"ghost"}><ChevronRight /></Button>
                        </PaginationItem>
                        <PaginationItem >
                            <Button disabled={lessonList?.last === true} onClick={handleLastPage} variant={"ghost"}><ChevronsRight /></Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}

export default LessonListComponent
