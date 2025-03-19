'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { CreateCourseSchema } from '@/schema/course';
import { z } from 'zod';
import { uploadImageCloud } from '@/app/api/image/image.api';
import { Domain } from '@/types/domain';
import { createCourse } from '@/app/api/course/course.api';
import { CirclePlus, LoaderCircle } from 'lucide-react';
import { toast } from "sonner";
import { DifficultyLevel } from '@/types/difficulty-level';

interface CreateNewCourseFormProps {
    token: string | undefined;
    fetchCourses: () => Promise<void>;
    domains: Domain[] | [];
    levels: DifficultyLevel[] | [];
    loading: boolean;
}
const CreateNewCourseForm = ({ token, fetchCourses, domains, levels, loading }: CreateNewCourseFormProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm({
        resolver: zodResolver(CreateCourseSchema),
        defaultValues: {
            title: '',
            description: '',
            domainId: 0,
            difficultyLevelId: 0,
            estimatedDuration: '',
            thumbnailUrl: ''
        },
    });

    const isValidFileType = (file: File) => {
        const acceptedTypes = ["image/png", "image/jpeg", "image/jpeg"];
        return acceptedTypes.includes(file.type);
    };



    const handleOnChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && isValidFileType(file)) {
            setSelectedFile(file); // Lưu file thực tế vào state
            const reader = new FileReader();
            reader.onload = (onLoadEvent) => {
                setImageSrc(onLoadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageSrc(null);
            setSelectedFile(null);
            alert("Invalid file!");
        }
    };


    const onSubmit = async (values: z.infer<typeof CreateCourseSchema>) => {
        try {
            setIsPending(true);

            let imgUrl: string | undefined;

            // Nếu thumbnailUrl đã có sẵn từ form (là string), thì giữ nguyên
            if (typeof values.thumbnailUrl === "string") {
                imgUrl = values.thumbnailUrl;
            }

            // Nếu có ảnh được chọn, upload lên cloud
            if (selectedFile instanceof File) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                imgUrl = await uploadImageCloud(formData);
            }

            // Đảm bảo thumbnailUrl không phải undefined trước khi gọi API
            if (!imgUrl) {
                alert("Thumbnail is required!");
                setIsPending(false);
                return;
            }

            const finalData = {
                ...values,
                thumbnailUrl: imgUrl, // Chắc chắn đây là string hợp lệ
            };

            const createRespond = await createCourse(finalData, token as string);
            if (createRespond.success === false) {
                toast.error("Failed to create new course!!");
            } else {
                toast.success("Create new course successfully!!");
                setIsDialogOpen(false);
                fetchCourses();
                form.reset();
            }

        } catch (error) {
            console.error("Error creating course:", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                <CirclePlus />Create new course
            </DialogTrigger>
            <DialogContent width='700px'>
                <DialogHeader>
                    <DialogTitle>Create new course</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <div className='flex flex-row space-x-14'>
                            <div className='grid grid-cols-1 gap-4'>
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <Label>Title</Label>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                className='w-[300px]'
                                                placeholder="Enter Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <Label>Description</Label>
                                        <FormControl>
                                            <Textarea
                                                disabled={isPending}
                                                className='w-[300px]'
                                                placeholder="Enter description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="estimatedDuration" render={({ field }) => (
                                    <FormItem>
                                        <Label>Estimated Duration</Label>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                className='w-[300px]'
                                                placeholder="Enter estimated duration" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="domainId" render={({ field }) => (
                                    <FormItem>
                                        <Label>Domain</Label>
                                        <Select
                                            disabled={isPending || loading}
                                            onValueChange={(value) => field.onChange(Number(value))}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loading ? "loading ..." : "Select a domain"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    domains?.map((domain) => (
                                                        <SelectItem key={domain.domainId} value={domain.domainId.toString()}>
                                                            {domain.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <FormField control={form.control} name="difficultyLevelId" render={({ field }) => (
                                    <FormItem>
                                        <Label>Level</Label>
                                        <Select
                                            disabled={isPending || loading}
                                            onValueChange={(value) => field.onChange(Number(value))}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loading ? "loading ..." : "Select a level"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    levels?.map((level) => (
                                                        <SelectItem key={level.levelId} value={level.levelId.toString()}>
                                                            {level.tag} : {level.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                type="file"
                                                id="imageImporter"
                                                accept="image/*"
                                                className=""
                                                ref={fileInputRef}
                                                onChange={(event) => {
                                                    handleOnChangeImage(event);
                                                    if (event.target.files?.[0]) {
                                                        field.onChange(event.target.files[0]); // Lưu file vào form
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {imageSrc && <img src={imageSrc} alt="Preview" className="max-w-xs mt-2" />}
                                        <Button disabled={isPending} type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            Choose
                                        </Button>

                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        <div className='w-full flex justify-end'>
                            <Button disabled={isPending} type="submit">
                                {isPending ? <><LoaderCircle className="animate-spin" /> Creating ...</> : "Create course"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateNewCourseForm