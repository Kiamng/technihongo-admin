'use client'
import { createScript, deleteScript, getMeetingById, getScriptsByMeetingId, updateMeeting, updateScript, updateScriptOrder } from '@/app/api/meeting/meeting.api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { MeetingSchema, ScriptSchema } from '@/schema/meeting';
import { Meeting } from '@/types/meeting';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpDown, CornerDownLeft, Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ScriptsInForm from '../_components/scripts-in-form-render';
import EmptyStateComponent from '@/components/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import ImportCSVPopup from '../../course-management/_components/spreadsheet-import/import-csv-popup';
import { handleScriptFileUpload } from '../_components/scripts-import';
import ScriptUpdateOrder from '../_components/update-scripts-order';
import { DropResult } from '@hello-pangea/dnd';

type ScriptInForm = z.infer<typeof ScriptSchema>;
export default function MeetingDetail() {
    const { meetingId } = useParams();
    const { data: session } = useSession()

    const [intialMeeting, setInitialMeeting] = useState<Meeting>();
    const [isSavingNewOrder, startSavingNewOrderTransition] = useTransition();
    const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);
    const [initialOrder, setInitialOrder] = useState<ScriptInForm[]>([]);
    const [newScriptOrder, setNewScriptOrder] = useState<ScriptInForm[]>(
        [],
    );

    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, startTransition] = useTransition();

    const [changedScripts, setChangedScripts] = useState<ScriptInForm[]>([]);


    const speakQuestion = (
        question: string,
    ) => {
        const utterance = new SpeechSynthesisUtterance(question);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.lang = "ja-JP";
        speechSynthesis?.speak(utterance);
    };


    const form = useForm<z.infer<typeof MeetingSchema>>({
        resolver: zodResolver(MeetingSchema),
        defaultValues: {
            infomation: {
                title: "",
                description: "",
                voiceName: "",
                isActive: false
            },
            scripts: [
            ],
        },
    });

    {/*====================================== Update order ======================================*/ }

    const handleUpdateOrderToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const hasUnSavedScripts =
            form.getValues().scripts.some((script) => !script.scriptId) ||
            changedScripts.length > 0;

        if (hasUnSavedScripts) {
            toast.error(
                "Bạn cần lưu tất cả các nội dung trước khi cập nhật thứ tự.",
            );

            return;
        }

        setIsEditingOrder(!isEditingOrder);
        if (!isEditingOrder) {
            setNewScriptOrder([...initialOrder]);
        }
    };

    const handleCancelUpdateOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditingOrder(false);
        form.setValue("scripts", initialOrder);
    };

    const handleSaveNewOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startSavingNewOrderTransition(async () => {
            try {
                const newOrder = newScriptOrder.map(
                    (script) => script.scriptOrder,
                );

                await updateScriptOrder(
                    session?.user.token as string,
                    intialMeeting?.meetingId as number,
                    newOrder as number[],
                );

                toast.success("Cập nhật thứ tự thành công");
                setInitialOrder([...newScriptOrder]);
                setIsEditingOrder(false);
            } catch (error) {
                console.error("Đã có lỗi xảy ra trong quá trình cập nhật thứ tự", error);
                toast.error("Cập nhật thứ tự thất bại");
            }
        });
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        const newScripts = Array.from(form.getValues().scripts);
        const [removed] = newScripts.splice(source.index, 1);

        newScripts.splice(destination.index, 0, removed);

        form.setValue("scripts", newScripts);

        setNewScriptOrder([...newScripts]);
    };

    {/*====================================== Update scripts ======================================*/ }

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "scripts",
    });

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }
        handleScriptFileUpload(file)
            .then((scripts) => {
                scripts.forEach((script) => {
                    append({
                        scriptId: null,
                        question: script.question,
                        answer: script.answer,
                        scriptOrder: 0
                    });
                });
            })
            .catch((error) => {
                console.error("Error importing CSV:", error);
            });
        e.target.value = '';
    };

    const handleInsertNew = () => {
        append({
            scriptId: null,
            question: "",
            answer: "",
            scriptOrder: 0
        });
    };

    const handleDelete = (index: number) => {
        const selectedQuestion = form.getValues().scripts[index];

        remove(index);

        if (selectedQuestion.scriptId) {
            deleteScript(session?.user.token as string, selectedQuestion.scriptId)
                .then(() => {
                    toast.success('Nội dung được xóa thành công!');
                })
                .catch((error) => {
                    console.error("Đã có lỗi xảy trong quá trình xóa nội dung:", error);
                    toast.error('Đã có lỗi xảy trong quá trình xóa nội dung');
                });
        } else {
            toast.success('Nội dung được xóa thành công!');
        }
    };

    const addChangedScript = (index: number) => {
        const updatedScripts = [...form.getValues().scripts];
        const script = updatedScripts[index];

        if (!script.scriptId) {
            return;
        }

        const existingIndex = changedScripts.findIndex(q => q.scriptId === script.scriptId);

        if (existingIndex > -1) {
            const updatedChangedQuestions = [...changedScripts];
            updatedChangedQuestions[existingIndex] = { ...script };
            setChangedScripts(updatedChangedQuestions);
        } else {
            setChangedScripts(prev => [...prev, { ...script }]);
        }
    };

    const getBorderClass = (field: ScriptInForm) => {
        if (!field.scriptId) {
            return "border-green-500";
        }

        return changedScripts.some(q => q.scriptId === field.scriptId)
            ? "border-yellow-500"
            : "";
    };

    const onSubmit = (data: z.infer<typeof MeetingSchema>) => {
        console.log(data);

        if (data.scripts.length < 5) {
            toast.error("Phải có ít nhất 5 nội dung");
            return;
        }

        if (!data.infomation.voiceName) {
            toast.error("Vui lòng chọn 1 giọng nói");
            return;
        }

        const updatedScripts = data.scripts;
        const newScripts = updatedScripts.filter(
            (script) => !script.scriptId,
        );
        console.log('new scripts :', newScripts);
        console.log('old scripts :', changedScripts);
        console.log('information :', data.infomation);
        startTransition(async () => {
            const isMeetingChanged =
                intialMeeting?.title !== data.infomation.title ||
                intialMeeting?.description !== data.infomation.description ||
                intialMeeting?.isActive !== data.infomation.isActive ||
                intialMeeting.voiceName !== data.infomation.voiceName

            if (isMeetingChanged) {
                try {
                    const updateResponse = await updateMeeting(
                        session?.user.token as string,
                        intialMeeting?.meetingId as number,
                        data.infomation.title,
                        data.infomation.description as string,
                        data.infomation.isActive,
                        data.infomation.voiceName
                    );

                    if (updateResponse.success === false) {
                        toast.error("Cập nhật thông tin hội thoại thất bại");
                    } else {
                        toast.success("Cập nhật thông tin hội thoại thành công");
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật thông tin hội thoại:", error);
                    toast.error("Có lỗi xảy ra khi cập nhật thông tin hội thoại");
                }
            }

            if (newScripts.length > 0) {
                try {
                    for (const script of newScripts) {
                        await createScript(
                            session?.user.token as string,
                            intialMeeting?.meetingId as number,
                            script.question,
                            script.answer
                        );
                    }
                } catch (error) {
                    console.error("Lỗi khi tạo mới nội dung:", error);
                }
            }
            if (changedScripts.length > 0) {
                try {
                    for (const script of changedScripts) {
                        if (script?.scriptId) {
                            const updateResponse = await updateScript(
                                session?.user.token as string,
                                script.scriptId,
                                script.question,
                                script.answer
                            );

                            if (updateResponse.success === false) {
                                toast.error(
                                    `Cập nhật nội dung thất bại: "${script?.question}"`,
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật nội dung:", error);
                }
            }
            setChangedScripts([]);
            await fetchMeeting();
        })
    }


    const fetchMeeting = async () => {
        if (!session) {
            toast.error('Đăng nhập để tiếp tục')
            return
        }

        try {
            const meeting = await getMeetingById(session?.user.token, Number(meetingId))
            setInitialMeeting(meeting)
            form.setValue("infomation", {
                title: meeting.title,
                description: meeting.description,
                isActive: meeting.isActive,
                voiceName: meeting.voiceName
            })
            const scripts = await getScriptsByMeetingId({
                token: session?.user.token,
                meetingId: meetingId as string,
                sortBy: 'scriptOrder',
                sortDir: 'asc'
            })
            console.log(scripts);

            if (scripts) {
                form.setValue('scripts', scripts.content)
            }
        }
        catch (error) {
            console.error('Đã có lỗi trong quá trình tải cuộc hội thoại: ', error)
            toast.error('Đã có lỗi trong quá trình tải cuộc hội thoại')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setIsLoading(true)

        fetchMeeting()
    }, [meetingId, session?.user.token])

    useEffect(() => {
        const loadVoices = () => {
            const synth = window.speechSynthesis
            const allVoices = synth.getVoices()
            const japaneseVoices = allVoices.filter((v) => v.lang.startsWith('ja') && !v.name.toLowerCase().includes('google'))
            setVoices(japaneseVoices)
        }

        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices
            loadVoices()
        }
    }, [])


    if (isLoading) {
        return <Skeleton className='w-full min-h-screen' />
    }

    return (
        <div className='w-full flex flex-col space-y-6'>
            <Link href={`/meeting-management`}>
                <Button
                    variant="outline"
                >
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </Link>
            <Form {...form}>
                <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='w-full flex flex-row justify-between'>
                        <div className='flex flex-row space-x-4 items-center'>
                            <h1 className="text-4xl font-bold">Thông tin cuộc hội thoại</h1>
                            <FormField
                                control={form.control}
                                name="infomation.isActive"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === 'true')}
                                            value={field.value !== undefined ? String(field.value) : ''}>
                                            <FormControl>
                                                <SelectTrigger className={field.value
                                                    ? "bg-[#56D071] text-[#56D071] bg-opacity-10"
                                                    : "bg-[#FD5673] text-[#FD5673] bg-opacity-10"}>
                                                    <SelectValue placeholder="Trạng thái hoạt động" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">Đang hoạt động</SelectItem>
                                                <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">không hoạt động</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            className="hover:scale-105 transition-all duration-100 text-lg"
                            disabled={isSaving}
                            type="submit"
                        >
                            {isSaving ? <><Loader2 className='animate-spin' /> Đang lưu...</> : "Lưu"}
                        </Button>
                    </div>
                    <Separator />
                    <div className='w-full flex flex-row space-x-6'>
                        <div className='flex-1 flex-col flex space-y-6'>
                            <FormField
                                control={form.control}
                                name="infomation.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên hội thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tên cuộc hội thoại" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="infomation.description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Thêm 1 mô tả"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex-1 flex-col flex space-y-6'>
                            <FormField
                                control={form.control}
                                name="infomation.voiceName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giọng đọc</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                const selected = voices.find(voice => voice.name === value);
                                                setSelectedVoice(selected || null);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn một giọng nói tiếng Nhật" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {voices.map((voice, index) => (
                                                    <SelectItem key={index} value={voice.name}>
                                                        {voice.name} ({voice.lang})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <h1 className="text-4xl font-bold">Nội dung hội thoại ({fields.length})</h1>
                    <div className='w-full flex flex-row justify-between items-center'>
                        <ImportCSVPopup type="script" />
                        <div className='flex flex-row space-x-2'>
                            {isEditingOrder
                                ?
                                <>
                                    <Button
                                        className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                        disabled={isSavingNewOrder}
                                        type="button"
                                        variant={"outline"}
                                        onClick={handleCancelUpdateOrder}
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                        disabled={isSavingNewOrder}
                                        type="button"
                                        variant={"outline"}
                                        onClick={handleSaveNewOrder}
                                    >
                                        Lưu thứ tự
                                    </Button>
                                </>
                                : <Button
                                    className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                    disabled={isSaving}
                                    type="button"
                                    variant={"outline"}
                                    onClick={handleUpdateOrderToggle}
                                >
                                    Thay đổi thứ tự <ArrowUpDown />
                                </Button>
                            }
                        </div>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileImport}
                        className="hidden"
                    />

                    {isEditingOrder && fields ? (
                        <ScriptUpdateOrder
                            fields={fields}
                            handleDragEnd={handleDragEnd}
                        />
                    ) : (
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id}
                                    className={`flex flex-col space-y-5 p-5 rounded-lg border-[2px] shadow-md
                                ${getBorderClass(field)}`}
                                >
                                    <ScriptsInForm
                                        field={field}
                                        index={index}
                                        isSaving={isSaving}
                                        addChangedScript={addChangedScript}
                                        handleDelete={handleDelete}
                                        speakQuestion={speakQuestion} />
                                </div>
                            ))}
                        </div>
                    )}
                    {fields.length === 0
                        && <EmptyStateComponent
                            imgageUrl="https://allpromoted.co.uk/image/no-data.svg"
                            message="Cuộc hội thoại này chưa có nội dung nào" size={400} />}
                    <button type="button" onClick={handleInsertNew} className="w-full flex h-[70px] justify-center items-center rounded-lg shadow-md border-[1px] hover:scale-95 duration-100 transition-all ease-in-out">
                        <div className="flex space-x-4">
                            <Plus /> <span className="font-medium">Thêm mới</span>
                        </div>
                    </button>
                </form>
            </Form>
        </div>
    )
}
