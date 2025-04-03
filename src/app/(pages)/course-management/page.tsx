'use client'

import { columns } from "./_components/course/columns";
import { DataTable } from "@/components/data-table";
import CreateNewCourseForm from "./_components/course/add-course-pop-up";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CourseList } from "@/types/course";
import { DomainList } from "@/types/domain";
import { DifficultyLevel } from "@/types/difficulty-level";

import { getAllCourse } from "@/app/api/course/course.api";
import { getChildrenDomain } from "@/app/api/system-configuration/system.api";
import { getAllDifficultyLevel } from "@/app/api/difficulty-level/difficulty-level.api";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CourseManagementPage() {
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");
    const [domains, setDomains] = useState<DomainList>();
    const [selectedDomain, setSelectedDomain] = useState<number | null>(null)
    const [coursesList, setCoursesList] = useState<CourseList>();
    const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([])
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null)


    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const memoizedDomains = useMemo(() => domains, [domains]);
    const memoizedDifficultyLevels = useMemo(() => difficultyLevels, [difficultyLevels]);

    const handleNextPage = () => {
        if (coursesList?.last) {
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

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const response = await
                getAllCourse({
                    token: session?.user.token as string,
                    pageNo: currentPage,
                    pageSize: 5,
                    sortBy: "createdAt",
                    sortDir: "desc",
                    keyword: searchValue,
                    domainId: selectedDomain,
                    difficultyLevelId: selectedLevel
                });
            setCoursesList(response);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDomain = async () => {
        try {
            const response = await getChildrenDomain({ pageNo: 0, pageSize: 20, sortBy: "createdAt", sortDir: "desc" });
            setDomains(response);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDifficultyLevel = async () => {
        try {
            const response = await getAllDifficultyLevel();
            setDifficultyLevels(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);

        // Hủy bỏ timeout cũ (nếu có)
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Thiết lập timeout mới
        const id = setTimeout(() => {
            setDebouncedSearchValue(event.target.value);
        }, 500); // 500ms delay

        setTimeoutId(id); // Lưu lại timeoutID để có thể hủy sau
    };

    const handleDomainChange = (value: string) => {
        setSelectedDomain(value === "None" ? null : parseInt(value, 10));
        if (currentPage === 0) {
            return
        }
        setCurrentPage(0)
    };

    const handleLevelChange = (value: string) => {
        setSelectedLevel(value === "None" ? null : parseInt(value, 10));
        if (currentPage === 0) {
            return
        }
        setCurrentPage(0)
    };

    useEffect(() => {
        if (!session?.user?.token) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                await fetchCourses();
                await Promise.all([fetchDomain(), fetchDifficultyLevel()]);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load course or study plans.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.token]);

    useEffect(() => {
        if (!session?.user?.token) {
            return;
        }
        fetchCourses();
    }, [debouncedSearchValue, selectedDomain, currentPage, selectedLevel]);

    const loading = isLoading || !memoizedDomains || !memoizedDifficultyLevels.length;

    return (
        <div className="w-full space-y-6">

            <div className="flex justify-between items-center w-full">
                <h1 className="text-4xl font-bold">Course Management</h1>
                <CreateNewCourseForm
                    loading={loading}
                    levels={memoizedDifficultyLevels}
                    domains={memoizedDomains?.content || []}
                    fetchCourses={fetchCourses}
                    token={session?.user?.token} />

            </div>
            <div className="w-full flex flex-row justify-between">
                <Input
                    className="w-[300px]"
                    placeholder="Search name"
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <div className="flex flex-row space-x-4">
                    <Select onValueChange={handleDomainChange} disabled={loading}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder={loading ? "Loading domains ..." : "Select a domain"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="None">
                                None
                            </SelectItem>
                            {memoizedDomains?.content.map((domain) => (
                                <SelectItem key={domain.domainId} value={domain.domainId.toString()}>
                                    {domain.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleLevelChange} disabled={loading}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder={loading ? "Loading level ..." : "Select a level"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="None">
                                None
                            </SelectItem>
                            {memoizedDifficultyLevels.map((level) => (
                                <SelectItem key={level.levelId} value={level.levelId.toString()}>
                                    {level.tag} : {level.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DataTable columns={columns} data={coursesList?.content || []} isLoading={isLoading} />
            <Pagination className="space-x-6">
                <PaginationContent>
                    <PaginationItem >
                        <Button disabled={currentPage === 0} onClick={handlePreviousPage} variant={"ghost"}><ChevronLeft /> Previous</Button>
                    </PaginationItem>
                    <PaginationItem>
                        {currentPage + 1}/{coursesList?.totalPages}
                    </PaginationItem>
                    <PaginationItem onClick={handleNextPage}>
                        <Button disabled={coursesList?.last === true} onClick={handleNextPage} variant={"ghost"}>Next <ChevronRight /></Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
