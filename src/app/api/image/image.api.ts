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
export const uploadImageCloud = async (formData: FormData) => {
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUD_IMAGE_UPLOAD_PRESET || "default_preset");
    try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data: UploadResponse = await response.json();

                if (!response.ok) {
                    throw new Error(data.error?.message || 'Upload failed');
                }

                return data.secure_url;

            } catch (error) {
                console.error('Upload error:', error);
                return; // Dừng lại nếu upload thất bại
            }
}