'use client'
import { getAllCourse } from "@/app/api/course/course.api";
import { Course } from "@/types/course";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/data-table";
import CreateNewCourseForm from "./_components/add-course-pop-up";

export default function CourseManagementPage() {
    const { data: session } = useSession();
    const [isLoading, setIsloading] = useState<boolean>(false)
    const [courses, setCourses] = useState<Course[]>([]);
    const fetchCourses = async () => {
        try {
            setIsloading(true);
            const response = await getAllCourse("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0Q001QGdtYWlsLmNvbSIsImlhdCI6MTc0MTA3MjQzNywiZXhwIjoxNzQxMTU4ODM3fQ.7-d6nlqhMh7LwtbpfQeuQEKExoj56uD2eSG61byia8RZavFpn7wFPYGfnHA8CfvHRobxV7TPra1qBSsZgiqUUg");
            console.log(response);
            console.log(session?.user?.token);

            setCourses(response);

        } catch (err) {
            console.error(err);
        } finally {
            setIsloading(false);
        }
    };
    useEffect(() => {
        // if (!session?.user?.token) {
        //     return;
        // }



        fetchCourses();
    }, [session?.user?.token]);

    return (
        <div className="w-full">

            <div className="flex justify-between items-center mb-6 w-full">
                <h1 className="text-4xl font-bold">Course Management</h1>
                <CreateNewCourseForm token={session?.user.token} fetchCourses={fetchCourses} />
            </div>
            <DataTable columns={columns} searchKey="title" data={courses} isLoading={isLoading} />
            {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
        </div>
    )
}
