import { ImagePlus } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
interface QuestionImageUploadProps {
    handleImageUpload: (index: number, imageUrl: string) => void,
    index: number,
    isSaving: boolean
}
const QuestionImageUpload = ({ handleImageUpload, index, isSaving }: QuestionImageUploadProps) => {
    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUD_IMAGE_UPLOAD_PRESET}
            options={{ sources: ["local", "camera", "url"], resourceType: "auto" }}
            onSuccess={(result) => {
                if (typeof result.info === "object" && result.info !== null) {
                    const uploadInfo = result.info;
                    const imageUrl = uploadInfo.secure_url;
                    handleImageUpload(index, imageUrl);
                }
            }}
        >
            {({ open }) => (
                <button
                    disabled={isSaving}
                    type='button'
                    className="border-dashed border-[2px] rounded-lg h-[92px] w-32 flex items-center justify-center text-slate-500 hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"
                    onClick={() => open()}
                >
                    <ImagePlus />
                </button>
            )}
        </CldUploadWidget>
    )
}

export default QuestionImageUpload
