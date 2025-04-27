'use client'

import { getAllMeeting } from "@/app/api/meeting/meeting.api"
import EmptyStateComponent from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { MeetingList } from "@/types/meeting"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, CirclePlus, Mic } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AddNewMeetingPopup from "./_components/add-new-meeting-popup"
import { Separator } from "@/components/ui/separator"

export default function MeetingManagementPage() {
    const { data: session } = useSession()

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [sortDir, setSortDir] = useState<string>("desc")

    const [meetingListData, setMeetingListData] = useState<MeetingList>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isAddModalPopup, setIsAddModalPopup] = useState<boolean>(false)

    const handlePreviousPage = () => {
        if (currentPage === 0) {
            return
        }
        setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (meetingListData?.last) {
            return
        }
        setCurrentPage(currentPage + 1)
    }

    const fetchMeetingList = async () => {
        try {
            if (!session?.user.token) {
                throw new Error("No token found");
            }
            const meeting = await getAllMeeting({
                token: session?.user.token,
                pageNo: currentPage,
                pageSize: 5,
                sortBy: 'createdAt',
                sortDir: sortDir
            })
            setMeetingListData(meeting)
        } catch (error) {
            console.error(`Đã có lỗi trong quá trình tải các hội thoại:`, error);
            toast.error(`Đã có lỗi trong quá trình tải các hội thoại`)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {

        fetchMeetingList()
    }, [session?.user.token, currentPage, sortDir])

    if (isLoading) {
        return <Skeleton className="w-full min-h-screen" />
    }

    return (
        <div className="w-full flex flex-col space-y-6">
            <div className="w-full flex flex-row justify-between">
                <div className="flex space-x-2 items-center">
                    <h1 className="text-4xl font-bold">Hội thoại</h1>
                    < Mic size={30} />
                </div>
                <Button onClick={() => setIsAddModalPopup(true)} className="text-lg"><CirclePlus />Thêm mới hội thoại</Button>
            </div>

            <Separator />

            <div className="w-full flex justify-between">
                <div className="text-xl font-bold">
                    Danh sách hội thoại({meetingListData?.totalElements}):
                </div>
                <div className="flex flex-row space-x-4 items-center">
                    <span>Sắp xếp:</span>
                    <Select value={sortDir} onValueChange={(value) => { setSortDir(value); setCurrentPage(0); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Thời gian tạo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Mới nhất</SelectItem>
                            <SelectItem value="asc">Cũ nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {meetingListData
                ? meetingListData.content.map((meeting) => (
                    <Link href={`/meeting-management/${meeting.meetingId}`} key={meeting.meetingId}>
                        <div className="p-4 w-full flex flex-row justify-between items-center rounded-2xl border-[1px] hover:-translate-y-1 duration-300 transition-all hover:bg-slate-100">
                            <div className="flex flex-row space-x-4 items-center">
                                <div className="p-[10px] rounded-full bg-green-300">
                                    <Mic className="text-green-600" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row space-x-2">
                                        <div className="text-xl font-bold">{meeting.title}</div>
                                        <div className="text-xl font-medium">{meeting.description}</div>
                                    </div>
                                    <div>
                                        {format(new Date(meeting.createdAt), "HH:mm, dd/MM/yyyy")}
                                    </div>
                                </div>
                            </div>
                            {meeting.isActive
                                ? <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">Đang hoạt động</div>
                                : <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">Không hoạt động</div>}
                        </div>
                    </Link>
                ))
                : <EmptyStateComponent
                    message={"Không tìm thấy cuộc hội thoại nào"}
                    size={400}
                    imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp" />
            }
            {meetingListData && meetingListData?.totalPages > 1 &&
                <Pagination className="space-x-6 mx-auto">
                    <PaginationContent>
                        <PaginationItem >
                            <Button disabled={currentPage === 0} onClick={handlePreviousPage} variant={"ghost"}><ChevronLeft /></Button>
                        </PaginationItem>
                        <PaginationItem>
                            {currentPage + 1}/{meetingListData.totalPages}
                        </PaginationItem>
                        <PaginationItem>
                            <Button disabled={meetingListData.last === true} onClick={handleNextPage} variant={"ghost"}><ChevronRight /></Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            }

            {isAddModalPopup &&
                <AddNewMeetingPopup
                    fetchMeetingList={fetchMeetingList}
                    onClose={setIsAddModalPopup}
                    onOpen={isAddModalPopup}
                    token={session?.user.token as string} />}
        </div>
    )
}