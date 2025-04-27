'use client'

import { createMeeting } from "@/app/api/meeting/meeting.api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Text } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


interface AddNewMeetingPopupProps {
    token: string;
    onOpen: boolean,
    onClose: (value: boolean) => void;
    fetchMeetingList: () => Promise<void>
}

const AddNewMeetingPopup = ({ token, onOpen, onClose, fetchMeetingList }: AddNewMeetingPopupProps) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    const handleSubmit = async () => {
        if (!title) {
            toast.warning(`Tên không được bỏ trống !`)
            return
        }

        setIsPending(true)
        try {
            const response = await createMeeting(token, title, description)
            if (response.success === true) {
                toast.message(`Tạo mới hội thoại thành công`)
                fetchMeetingList()
                onClose(false)
            }
        } catch (error) {
            console.error(`Có lỗi trong quá trình tạo hội thoại`, error)
            toast.error(`Có lỗi trong quá trình tạo hội thoại`)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={onOpen} onOpenChange={onClose}>
            <DialogContent width='700px'>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-center">Tạo mới một cuộc hội thoại</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col space-y-6">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className="flex space-x-2" htmlFor="title">
                            <span>Tên hội thoại</span>
                            <Mic size={16} strokeWidth={1.5} />
                        </Label>
                        <Input id="title"
                            className='w-[300px]'
                            disabled={isPending}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tên của cuộc hội thoại" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className="flex space-x-2" htmlFor="description">
                            <span>Mô tả</span>
                            <Text size={16} strokeWidth={1.5} />
                        </Label>
                        <Textarea
                            id="description"
                            disabled={isPending}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Thêm một mô tả" />
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <div className="flex space-x-2">
                        <Button
                            disabled={isPending}
                            variant={"outline"}
                            onClick={() => onClose(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending}>{isPending
                                ? <><Loader2 className="animate-spin" /> Đang tạo</>
                                : "Tạo"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewMeetingPopup
