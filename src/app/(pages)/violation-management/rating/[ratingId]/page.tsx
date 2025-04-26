'use client'

import { getCourseById } from "@/app/api/course/course.api"
import { getRatingById } from "@/app/api/rating/rating.api"
import { getViolationSummary, processViolation } from "@/app/api/student-violation/student-violation.api"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"

import { Course } from "@/types/course"
import { Rating } from "@/types/rating"
import { ViolationSummary } from "@/types/student-violation"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight, CornerDownLeft, Flag, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import CourseCards from "../../_components/rating/course-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

const ViolationRatingSummary = () => {
    const { ratingId } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const { data: session } = useSession();

    const [currentPage, setCurrentPage] = useState<number>(0)
    const [sortDir, setSortDir] = useState<string>("desc");

    const [violationRating, setViolationRating] = useState<Rating>()
    const [summaryList, setSummaryList] = useState<ViolationSummary>()
    const [course, setCourse] = useState<Course>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [status, setStatus] = useState<string>("DISMISSED");
    const [reason, setReason] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const hanldeConfirm = async () => {

        if (!reason) {
            toast.warning("Chú thích không được để trống !")
            return
        }

        startTransition(async () => {
            try {
                const response = await processViolation(session?.user.token as string, summaryList?.descriptions.content?.[0].violationId as number, reason, status)
                if (response.success) {
                    toast.success("Xử lí báo cáo thành công")
                    router.push('/violation-management')
                }
            }
            catch (error) {
                console.log("Có lỗi xảy ra trong quá trình xử lí báo cáo:", error);
                toast.error("Có lỗi xảy ra trong quá trình xử lí báo cáo")
            }
        })
    }

    const handlePreviousPage = () => {
        if (currentPage === 0) {
            return
        }
        setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (summaryList?.descriptions.last) {
            return
        }
        setCurrentPage(currentPage + 1)
    }


    const fetchSummary = async () => {
        try {
            const summary = await getViolationSummary({
                token: session?.user.token as string,
                entityId: Number(ratingId),
                classifyBy: "Rating",
                pageNo: currentPage,
                pageSize: 5,
                status: "PENDING",
                sortBy: 'createdAt',
                sortDir: sortDir
            })
            if (summary) {
                console.log(summary);

                setSummaryList(summary)
                setReason(summary.descriptions.content?.[0].description)
            }
        } catch (error) {
            console.log('Có lỗi trong quá tình tải báo cáo liên quan:', error);
        }
    }

    const fetchCourse = async () => {
        try {

            const course = await getCourseById(session?.user.token as string, Number(courseId))
            if (course) {
                console.log(course);
                setCourse(course)
            }
        } catch (error) {
            console.log('Có lỗi trong quá tình tải khóa học bị báo cáo:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const rating = await getRatingById(session?.user.token as string, Number(ratingId))
                console.log(rating);
                setViolationRating(rating)
                await Promise.all([fetchCourse(), fetchSummary()]);
            }
            catch (error) {
                console.log(error);
                toast.error('Có lỗi trong quá trình tải báo cáo vi phạm')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [ratingId, courseId, session?.user.token])

    useEffect(() => {
        fetchSummary()
    }, [currentPage, sortDir])

    if (isLoading) {
        <Skeleton className="w-full min-h-screen" />
    }

    return (
        <div className="w-full flex flex-col space-y-6">
            <Link href={`/violation-management`}>
                <Button
                    variant="outline"
                >
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </Link>
            <h1 className="text-4xl font-bold">Xử lí báo cáo</h1>
            <Separator />
            <div className="w-full flex flex-row space-x-6">
                <div className="w-1/2 flex flex-col space-y-6">
                    <div className="text-xl font-bold">Đánh giá:</div>
                    <div className="p-5 w-full flex flex-col space-y-4 border-[1px] rounded-2xl">
                        <div className="flex flex-row space-x-2">
                            <Avatar>
                                <AvatarImage src={violationRating?.profileImg} />
                                <AvatarFallback>{violationRating?.userName?.[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <div className="text-base font-semibold">{violationRating?.userName}</div>
                                <div className="text-sm text-gray-400">{violationRating?.createdAt ? format(new Date(violationRating.createdAt), "HH:mm, dd/MM/yyyy") : 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex flex-row space-x-1 items-center">
                            {violationRating?.rating && (
                                <>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <span
                                            key={index}
                                            className={`text-xl ${index < violationRating.rating ? 'text-orange-500' : 'text-gray-400'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </>
                            )}

                        </div>
                        <div className="text-base font-medium">{violationRating?.review}</div>
                    </div>

                    <Separator />

                    <div className="w-full flex flex-row justify-between items-center">
                        <div className="text-xl font-bold">Nội dung báo cáo:</div>
                        <div className="flex flex-row space-x-2 items-center">
                            <span>Ngày báo cáo:</span>
                            <Select value={sortDir} onValueChange={(value) => { setSortDir(value); setCurrentPage(0); }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Mới nhất</SelectItem>
                                    <SelectItem value="asc">Cũ nhất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {summaryList?.descriptions.content.map((violation) => (
                        <div key={violation.violationId} className="w-full p-4 border-[1px] flex flex-row justify-between items-center rounded-2xl">
                            <div className="flex flex-row space-x-4 items-center">
                                <div className="p-[6px] rounded-full bg-yellow-300">
                                    <Flag className="text-yellow-600" />
                                </div>
                                <div className="text-base font-medium">{violation.description}</div>
                            </div>
                            <div className="text-sm text-gray-400">{format(new Date(violation.createdAt), "HH:mm, dd/MM/yyyy")}</div>
                        </div>
                    ))}
                    {summaryList && summaryList?.descriptions.totalPages > 1 && (
                        <Pagination className="space-x-6 mx-auto">
                            <PaginationContent>
                                <PaginationItem >
                                    <Button disabled={currentPage === 0} onClick={handlePreviousPage} variant={"ghost"}><ChevronLeft /></Button>
                                </PaginationItem>
                                <PaginationItem>
                                    {currentPage + 1}/{summaryList?.descriptions.totalPages}
                                </PaginationItem>
                                <PaginationItem>
                                    <Button disabled={summaryList?.descriptions.last === true} onClick={handleNextPage} variant={"ghost"}><ChevronRight /></Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}

                    <Separator />

                    <div className="w-full flex flex-row justify-between items-center">
                        <div className="text-xl font-bold">Xử lí:</div>
                        <div className="flex flex-row space-x-4">
                            <Select disabled={isPending} value={status} onValueChange={(value) => { setStatus(value) }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Chọn xử lí" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DISMISSED">Bỏ qua</SelectItem>
                                    <SelectItem value="RESOLVED">Xóa đánh giá này</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button disabled={isPending} onClick={hanldeConfirm} className="hover:scale-105 transition-all duration-300">{isPending ? <><Loader2 className="animate-spin" />Đang xử lí</> : "Xác nhận"}</Button>
                        </div>
                    </div>
                    {status === "RESOLVED" && (
                        <Textarea disabled={isPending} placeholder="Hãy để lại 1 chú thích" value={reason} onChange={(e) => setReason(e.target.value)} />
                    )}
                </div>
                <div className="border-l-[1px] border-gray-300"></div>
                <div className="w-1/2 flex flex-col space-y-6">
                    <div className="text-xl font-bold">Khóa học:</div>
                    <div className="w-1/2">
                        {course ? <CourseCards course={course} /> : "loading"}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViolationRatingSummary
