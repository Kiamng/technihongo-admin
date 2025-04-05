'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCourseSchema } from "@/schema/course";
import { z } from "zod";
import { useRef, ChangeEvent, useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";


import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";


import { Course } from "@/types/course";
import { DomainList } from "@/types/domain";
import { DifficultyLevel } from "@/types/difficulty-level";
import { getAllDifficultyLevel } from "@/app/api/difficulty-level/difficulty-level.api";
import { getChildrenDomain } from "@/app/api/system-configuration/system.api";
import { Switch } from "@/components/ui/switch";


interface CourseFormProps {
    course?: Course;
    onSubmit: (values: z.infer<typeof updateCourseSchema>, selectedFile: File | null) => void;
    isPending: boolean;
    token: string
}

export default function CourseUpdateForm({ course, onSubmit, isPending, token }: CourseFormProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(course?.thumbnailUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [levels, setLevels] = useState<DifficultyLevel[]>();
    const [domains, setDomains] = useState<DomainList>();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm({
        resolver: zodResolver(updateCourseSchema),
        defaultValues: {
            title: course?.title || '',
            description: course?.description || '',
            domainId: course?.domain?.domainId || 0,
            difficultyLevelId: course?.difficultyLevel.levelId || 0,
            estimatedDuration: course?.estimatedDuration || '',
            thumbnailUrl: course?.thumbnailUrl || '',
            isPremium: course?.premium || false,
            isPublic: course?.publicStatus || false
        },
    });

    const isValidFileType = (file: File) => {
        const acceptedTypes = ["image/png", "image/jpeg"];
        return acceptedTypes.includes(file.type);
    };

    const handleOnChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && isValidFileType(file)) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (onLoadEvent) => {
                setImageSrc(onLoadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageSrc(null);
            setSelectedFile(null);
            toast.error("Invalid file type!");
        }
    };

    useEffect(() => {
        const fetchDomainAndLevel = async () => {
            try {
                setIsLoading(true)
                const levelResponse = await getAllDifficultyLevel(token);
                setLevels(levelResponse)
                const domainResponse = await getChildrenDomain({ token: token, pageNo: 0, pageSize: 20, sortBy: "createdAt", sortDir: "desc" });
                setDomains(domainResponse)
            }
            catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchDomainAndLevel()
    }, [course])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => onSubmit(values, selectedFile))} className="space-y-4 w-full">
                <div className='grid grid-cols-2 gap-6 w-full'>
                    <div className='grid grid-cols-1 gap-4'>
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <Label>Title</Label>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="Enter Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <Label>Description</Label>
                                <FormControl>
                                    <Textarea disabled={isPending} className='min-h-[100px]' placeholder="Enter description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="estimatedDuration" render={({ field }) => (
                            <FormItem>
                                <Label>Estimated Duration</Label>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="Enter estimated duration" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="w-full space-x-4 flex flex-row">
                            <FormField control={form.control} name="isPublic" render={({ field }) => (
                                <FormItem className="w-full">
                                    <Label>Public status</Label>
                                    <Select disabled={isPending} value={field.value?.toString()} onValueChange={(value) => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Public" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            <SelectItem value="true"><div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">ACTIVE</div></SelectItem>
                                            <SelectItem value="false"><div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">INACTIVE</div></SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                                control={form.control}
                                name="isPremium"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row space-x-4 items-center'>
                                        <FormLabel>Premium</FormLabel>
                                        <FormControl>
                                            <Switch
                                                disabled={true}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField control={form.control} name="domainId" render={({ field }) => (
                            <FormItem>
                                <Label>Domain</Label>
                                <Select disabled={isPending} value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a domain" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            isLoading ?
                                                "loading"
                                                : domains?.content.map((domain) => (
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
                    <div className="flex flex-col space-y-4">
                        <FormField control={form.control} name="difficultyLevelId" render={({ field }) => (
                            <FormItem>
                                <Label>Level</Label>
                                <Select disabled={isPending} value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a domain" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            isLoading ?
                                                "Loading"
                                                :
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
                        <FormField control={form.control} name="thumbnailUrl" render={() => (
                            <FormItem>
                                <FormLabel className="flex flex-row items-center justify-between">
                                    <div>Thumbnail Image </div>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        type="file"
                                        accept="image/*"
                                        className="w-[510px]"
                                        ref={fileInputRef}
                                        onChange={handleOnChangeImage}
                                    />
                                </FormControl>
                                {imageSrc && <img src={imageSrc} alt="Preview" className="max-w-xs mt-2" />}
                                <Button
                                    disabled={isPending} type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    Choose
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>

                <Button disabled={isPending} type="submit">
                    {isPending ? <><LoaderCircle className="animate-spin" /> Saving...</> : "Save"}
                </Button>
            </form>
        </Form>
    );
}
