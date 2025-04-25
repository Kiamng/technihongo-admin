"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadWithPreviewProps {
    label: string;
    accept: string;
    disabled?: boolean;
    onFileSelected: (file: File) => void;
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
    onClear: () => void;
}

export default function UploadWithPreview({
    label,
    accept,
    disabled,
    onFileSelected,
    previewUrl,
    setPreviewUrl,
    onClear,
}: UploadWithPreviewProps) {
    const [fileName, setFileName] = useState<string>("");
    const MAX_VIDEO_SIZE = 524_288_000; // 500MB
    const MAX_PDF_SIZE = 10_485_760;    // 10MB

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClickUpload = () => {
        if (inputRef.current && !disabled) {
            inputRef.current.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isPdf = accept.includes("pdf");
        const isVideo = accept.includes("video");

        if (isPdf) {
            if (!file.name.toLowerCase().endsWith(".pdf")) {
                toast.error("Please upload a PDF file.");
                return;
            }
            if (file.size > MAX_PDF_SIZE) {
                toast.error("The PDF file is too large. Please choose a file under 10MB.");
                return;
            }
        }

        if (isVideo) {
            const validExts = [".mp4"];
            const isValidExt = validExts.some(ext => file.name.toLowerCase().endsWith(ext));
            if (!isValidExt) {
                toast.error("The video must be in mp4 format.");
                return;
            }
            if (file.size > MAX_VIDEO_SIZE) {
                toast.error("The video is too large. Please choose a video under 500MB.");
                return;
            }
        }

        setFileName(file.name);
        setPreviewUrl(URL.createObjectURL(file));
        onFileSelected(file);
    };

    const handleClear = () => {
        setFileName("");
        setPreviewUrl(null);
        onClear();

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Input className="hidden" readOnly value={fileName} />
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    hidden
                    onChange={handleChange}
                    disabled={disabled}
                />
                <Button type="button" size="sm" onClick={handleClickUpload} disabled={disabled}>
                    Upload {label}
                </Button>
                {previewUrl && (
                    <Button disabled={disabled} type="button" variant="destructive" size="sm" onClick={handleClear}>
                        Clear {label}
                    </Button>
                )}
            </div>

            {previewUrl ? (
                label.toLowerCase() === "video" ? (
                    <div className="relative w-full h-0 pb-[56.25%] bg-black">
                        <video controls className="absolute top-0 left-0 w-full h-full object-contain">

                            <source src={previewUrl} type="video/mp4" />
                            <source src={previewUrl.replace(".mp4", ".webm")} type="video/webm" />
                            <source src={previewUrl.replace(".mp4", ".ogv")} type="video/ogg" />

                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : label.toLowerCase() === "pdf" ? (
                    <iframe src={previewUrl} title="PDF Preview" className="w-full h-[500px] border mt-4" />
                ) : (
                    <img src={previewUrl} alt="Preview" className="mt-4 rounded-md max-h-[300px]" />
                )
            ) : (
                <p className="text-slate-400 mt-2">No {label.toLowerCase()} selected</p>
            )}
        </div>
    );
}
