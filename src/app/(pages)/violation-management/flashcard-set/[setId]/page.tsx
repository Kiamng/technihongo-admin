'use client'

import { getStuSetById } from "@/app/api/student-flashcard-set/student-flashcard-set.api";
import { getViolationSummary, processViolation } from "@/app/api/student-violation/student-violation.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { StudentFlashcardSet } from "@/types/student-flashcard-set";
import { ViolationSummary } from "@/types/student-violation";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, CornerDownLeft, Flag, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const ViolationFlashcardSetSummary = () => {
    const { setId } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [currentPage, setCurrentPage] = useState<number>(0)
    const [sortDir, setSortDir] = useState<string>("desc");

    const [violatedSet, setViolatedSet] = useState<StudentFlashcardSet>()
    const [summaryList, setSummaryList] = useState<ViolationSummary>()
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
                entityId: Number(setId),
                classifyBy: "FlashcardSet",
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const set = await getStuSetById(session?.user.token as string, Number(setId))
                setViolatedSet(set)
                await fetchSummary()
            }
            catch (error) {
                console.log(error);
                toast.error('Có lỗi trong quá trình tải báo cáo vi phạm')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [setId, session?.user.token])

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
                                    <SelectItem value="RESOLVED">Ẩn flashcard này</SelectItem>
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
                    <div className="text-xl font-bold">Flashcard:</div>
                    <div className="flex flex-row space-x-2">
                        <Avatar>
                            <AvatarImage src={violatedSet?.profileImg} />
                            <AvatarFallback>{violatedSet?.userName?.[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <div className="text-base font-semibold">{violatedSet?.userName}</div>
                            <div className="text-sm text-gray-400">{violatedSet?.createdAt ? format(new Date(violatedSet.createdAt), "HH:mm, dd/MM/yyyy") : 'N/A'}</div>
                        </div>
                    </div>

                    <h1 className="text-base">Flashcard: <span>{violatedSet?.title}</span></h1>

                    <div className="table-responsive">
                        <table className="min-w-full border-collapse rounded-2xl">
                            <thead>
                                <tr>
                                    <th className="border p-2">Thứ tự</th>
                                    <th className="border p-2">Từ vựng</th>
                                    <th className="border p-2">Định nghĩa</th>
                                    <th className="border p-2">Ảnh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violatedSet?.flashcards?.map((flashcard) => (
                                    <tr key={flashcard.cardOrder} className="text-center">
                                        <td className="border p-2">{flashcard.cardOrder}</td>
                                        <td className="border p-2">{flashcard.japaneseDefinition}</td>
                                        <td className="border p-2">{flashcard.vietEngTranslation}</td>
                                        <td className="border p-2">
                                            {flashcard.imageUrl ? (
                                                <img src={flashcard.imageUrl} alt="Flashcard Image" className="max-w-full h-auto" />
                                            ) : (
                                                <span className="text-gray-500">Trống</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViolationFlashcardSetSummary
