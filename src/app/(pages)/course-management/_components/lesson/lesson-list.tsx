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
    isActive: boolean
    studyPlanId: number;
    isDefaultStudyPlan: boolean;
    defaultStudyPlanId: number;
    token: string;
}

const LessonListComponent = ({ isActive, studyPlanId, token, isDefaultStudyPlan, defaultStudyPlanId }: LessonListProps) => {
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
            toast.error("Tải bài học thất bại");
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

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const id = setTimeout(() => {
            setCurrentPage(0)
            setDebouncedSearchValue(event.target.value);
        }, 500);

        setTimeoutId(id);
    };

    const toggleLessonResource = async (lessonId: number) => {
        if (expandedLessonId === lessonId) {
            setExpandedLessonId(null);
            return;
        }

        setExpandedLessonId(lessonId);

        if (lessonResources[lessonId]) return;

        setIsLoadingLR(true);

        try {
            const resources = await getLessonResourceByLessonId(token, lessonId);
            setLessonResources(prev => ({
                ...prev,
                [lessonId]: Array.isArray(resources) ? resources : []
            }));
            if (resources === null) {
                console.warn(`Lesson ${lessonId} has no resources.`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Tải tài nguyên thất bại");
            setLessonResources(prev => ({
                ...prev,
                [lessonId]: []
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
                    Số bài học ({isLoading ? <LoaderCircle className="animate-spin" /> : lessonList?.totalElements})
                </div>
                {!isActive &&
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                            <CirclePlus />Thêm mới bài học
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
                }
            </div>
            <div className="w-full space-y-5">
                <div className="flex flex-row space-x-10 items-center">
                    <Input
                        className="w-[300px]"
                        placeholder="Tìm bài học"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <div className="space-x-2 flex flex-row items-center">
                        <span className="font-semibold">Thứ tự:</span>
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
                                    defaultStudyPlanId={defaultStudyPlanId}
                                    isActive={isActive}
                                />
                            ))
                        ) : (
                            <EmptyStateComponent
                                message={searchValue
                                    ? "Không tìm thấy"
                                    : "Kế hoạch học tập này chưa có bài học nào"}
                                size={400}
                                imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp" />
                        )}
                    </div>
                }
                {lessonList && lessonList?.content.length > 0 && (
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
                            <PaginationItem>
                                <Button disabled={lessonList?.last === true} onClick={handleNextPage} variant={"ghost"}><ChevronRight /></Button>
                            </PaginationItem>
                            <PaginationItem >
                                <Button disabled={lessonList?.last === true} onClick={handleLastPage} variant={"ghost"}><ChevronsRight /></Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </>
    );
}

export default LessonListComponent
