'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';

interface UploadResponse {
    secure_url: string;
    public_id: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    resource_type?: string;
    created_at?: string;
    original_filename?: string;
    error?: { message: string };
}

export default function Home() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Handle file selection
    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (onLoadEvent) => {
            setImageSrc(onLoadEvent.target?.result as string);
            setUploadData(null);
            setErrorMessage(null);
        };
        reader.readAsDataURL(file);
    };

    // Handle form submission
    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!fileInputRef.current?.files?.length) return;

        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        formData.append('upload_preset', "dvbxqttw"); // Replace with your actual preset

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dmc7a1uqf/upload`, {
                method: 'POST',
                body: formData,
            });

            const data: UploadResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Upload failed');
            }

            setImageSrc(data.secure_url);
            setUploadData(data);
            setErrorMessage(null);
        } catch (error) {
            console.error('Upload error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    return (
        <div className="w-full p-4">
            <form className="w-full flex flex-col gap-4" onSubmit={handleOnSubmit}>
                <input ref={fileInputRef} type="file" name="file" accept="image/*,video/*" onChange={handleOnChange} className="p-2 border rounded-md" />

                {imageSrc && <img src={imageSrc} alt="Preview" className="max-w-xs mt-2" />}

                {imageSrc && !uploadData && (
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Upload File</button>
                )}

                {errorMessage && (
                    <p className="text-red-500 mt-2">Error: {errorMessage}</p>
                )}

                {uploadData && (
                    <pre className="bg-gray-100 p-2 rounded-md overflow-auto text-sm">
                        {JSON.stringify(uploadData, null, 2)}
                    </pre>
                )}
            </form>
        </div>
    );
}
