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

/**
 * Upload file to Cloudinary manually by resource type and preset
 * @param formData A FormData instance with file, upload_preset, resource_type
 * @returns secure_url string or undefined if error
 */
export const uploadVideoPdfCloudinary = async (formData: FormData): Promise<string | undefined> => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data: UploadResponse = await response.json();

    if (!response.ok || data.error) {
      console.error("Upload failed:", data.error?.message);
      return undefined;
    }

    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    return undefined;
  }
};
