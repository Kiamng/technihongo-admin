'use client'
import { getAllCourse } from "@/app/api/course/course.api";
import { CourseList } from "@/types/course";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./_components/course/columns";
import { DataTable } from "@/components/data-table";
import CreateNewCourseForm from "./_components/course/add-course-pop-up";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function CourseManagementPage() {
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [isLoading, setIsloading] = useState<boolean>(false)
    const [coursesList, setCoursesList] = useState<CourseList>();

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
            setIsloading(true);
            const response = await getAllCourse({ token: session?.user.token as string, pageNo: currentPage, pageSize: 5, sortBy: "createdAt", sortDir: "desc" });
            console.log(response);
            setCoursesList(response);

        } catch (err) {
            console.error(err);
        } finally {
            setIsloading(false);
        }
    };
    useEffect(() => {
        if (!session?.user?.token) {
            return;
        }
        fetchCourses();
    }, [session?.user?.token, currentPage]);

    return (
        <div className="w-full space-y-6">

            <div className="flex justify-between items-center w-full">
                <h1 className="text-4xl font-bold">Course Management</h1>
                <CreateNewCourseForm fetchCourses={fetchCourses} token={session?.user?.token} />

            </div>
            <DataTable columns={columns} searchKey="title" data={coursesList?.content || []} isLoading={isLoading} />
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
