"use client"; // Quan trọng! Vì `useParams()` chỉ hoạt động trong Client Component

import { Button } from "@/components/ui/button";

import { LearningResourceSchema } from "@/schema/learning-resource";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerDownLeft, LoaderCircle, Youtube } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useTransition } from "react";
import { LearningResource } from "@/types/learning-resource";
import { Skeleton } from "@/components/ui/skeleton";

import { getLearningResourceById, updateLearningResource } from "@/app/api/learning-resource/learning-resource.api";
import LearningResourceUpdatePublicStatus from "@/app/(pages)/course-management/_components/learning-resource/update-public-status";


export default function EditLearningResourcePage() {
    const params = useParams(); // Lấy dữ liệu từ URL
    const { courseId, defaultStudyPlanId, studyPlanId, learningResourceId } = params;
    const [learningResource, setLearningResource] = useState<LearningResource>();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [pdfSrc, setPdfSrc] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(LearningResourceSchema),
        defaultValues: {
            title: "",
            description: "",
            videoUrl: "",
            videoFilename: "",
            pdfUrl: "",
            pdfFilename: "",
            premium: false
        },
    });

    useEffect(() => {
        if (!learningResourceId && !session?.user.token) {
            return
        }
        const fetchLearningResource = async () => {
            try {
                setIsLoading(true)
                const response = await getLearningResourceById(session?.user.token as string, parseInt(learningResourceId as string, 10));
                console.log(response);
                setLearningResource(response)
                form.setValue("title", response.title);
                form.setValue("description", response.description);
                form.setValue("videoUrl", response.videoUrl || "");
                form.setValue("videoFilename", response.videoFilename || "");
                form.setValue("pdfUrl", response.pdfUrl || "");
                form.setValue("pdfFilename", response.pdfFilename || "");
                form.setValue("premium", response.premium);
                setPdfSrc(response.pdfUrl);
                setVideoSrc(response.videoUrl)
            }
            catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchLearningResource()
    }, [learningResourceId])

    const onSubmit = async (values: z.infer<typeof LearningResourceSchema>) => {
        if (learningResource?.public === true) {
            toast.error("You can not update a public learning resource!");
            return
        }
        startTransition(async () => {
            try {
                const response = await updateLearningResource(session?.user.token as string, parseInt(learningResourceId as string, 10), values)
                console.log(response);
                if (response.success === true) {
                    toast.success("Saved learning resource successfully!!");
                } else {
                    toast.error("Failed to save learning resource");
                }
            } catch (error) {
                console.error("Error creating course:", error);
            }
        })
    }

    if (isLoading) return (
        <Skeleton className="w-full h-screen" />
    )

    return (
        <div className="w-full space-y-6">
            <Link href={`/course-management/${courseId}/study-plan/${defaultStudyPlanId}/detail/${studyPlanId}`}>
                <Button
                    variant="outline"
                >
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </Link>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-10">
                    <div className="w-full flex flex-row justify-between">
                        <div className="flex flex-row space-x-4 items-center">
                            <div className="rounded-full p-2 bg-[#FD5673] bg-opacity-10">
                                <Youtube className="text-[#FD5673]" size={28} />
                            </div>
                            <span className="text-4xl font-bold ">Edit Learning Resource Details</span>
                            {learningResource
                                ? <LearningResourceUpdatePublicStatus
                                    learningResource={learningResource}
                                    setLearningResource={setLearningResource}
                                    token={session?.user.token as string} />
                                : <LoaderCircle className="animate-spin" />}

                        </div>

                        <Button disabled={isPending} type="submit">
                            {isPending ? <><LoaderCircle className="animate-spin" /> Saving ...</> : "Save changes"}
                        </Button>
                    </div>
                    <div className="w-full flex flex-row space-x-8">
                        <div className="w-1/2 flex flex-col space-y-6">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title:</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Enter Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description:</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={isPending} placeholder="Enter description" {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="videoFilename" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video name (mp4, webm, ogv):</FormLabel>
                                    <div className="flex items-center space-x-2">
                                        <FormControl>
                                            <Input disabled={isPending} placeholder="Choose a video" {...field} readOnly />
                                        </FormControl>
                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUD_VIDEO_UPLOAD_PRESET}
                                            options={{ sources: ["local", "camera", "url"], resourceType: "video" }}
                                            onSuccess={(result) => {
                                                if (typeof result.info === "object" && result.info !== null) {
                                                    const uploadInfo = result.info; // Ép kiểu
                                                    setVideoSrc(uploadInfo.secure_url);
                                                    form.setValue("videoUrl", uploadInfo.secure_url);
                                                    form.setValue("videoFilename", uploadInfo.original_filename);
                                                }
                                            }}
                                        >
                                            {({ open }) => (
                                                <Button disabled={isPending} type="button" size="sm" onClick={() => open()}>
                                                    Upload Video
                                                </Button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {videoSrc ? (
                                <div className="relative w-full h-0 pb-[56.25%] bg-black"> {/* Container với tỷ lệ khung hình 16:9 */}
                                    <video controls className="absolute top-0 left-0 w-full h-full object-contain">
                                        {/* Cung cấp video MP4 đầu tiên */}
                                        <source src={videoSrc} type="video/mp4" />
                                        {/* Nếu video không phải MP4, thử WebM */}
                                        <source src={videoSrc.replace(".mp4", ".webm")} type="video/webm" />
                                        {/* Nếu video không phải MP4/WebM, thử OGG */}
                                        <source src={videoSrc.replace(".mp4", ".ogv")} type="video/ogg" />

                                        {/* Thông báo lỗi nếu trình duyệt không hỗ trợ video */}
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <p className="text-slate-400">No video selected</p>
                            )}
                        </div>
                        <div className="w-1/2 flex flex-col space-y-6">
                            <FormField control={form.control} name="pdfFilename" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PDF name:</FormLabel>
                                    <div className="flex items-center space-x-2">
                                        <FormControl>
                                            <Input disabled={isPending} placeholder="Choose pdf file" {...field} readOnly />
                                        </FormControl>
                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUD_PDF_UPLOAD_PRESET}
                                            options={{ sources: ["local", "camera", "url"], resourceType: "raw" }}
                                            onSuccess={(result) => {
                                                if (typeof result.info === "object" && result.info !== null) {
                                                    const uploadInfo = result.info;
                                                    setPdfSrc(uploadInfo.secure_url);
                                                    form.setValue("pdfUrl", uploadInfo.secure_url);
                                                    form.setValue("pdfFilename", uploadInfo.original_filename);
                                                }
                                            }}
                                        >
                                            {({ open }) => (
                                                <Button disabled={isPending} type="button" size="sm" onClick={() => open()}>
                                                    Upload PDF
                                                </Button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {pdfSrc ? (
                                <iframe
                                    title="pdf review"
                                    src={pdfSrc}  // sử dụng pdfSrc đã được cấp quyền công khai
                                    className="w-full h-screen border"
                                />
                            ) : (
                                <p className="text-slate-400">No PDF selected</p>
                            )}

                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};