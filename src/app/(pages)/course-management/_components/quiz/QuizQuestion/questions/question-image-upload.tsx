interface QuestionImageUploadProps {
    index: number;
    isSaving: boolean;
    handleImageSelect: (index: number, file: File) => void;
}

const QuestionImageUpload = ({ index, isSaving, handleImageSelect }: QuestionImageUploadProps) => {
    return (
        <>
            <input
                type="file"
                accept="image/*"
                id={`quiz-image-upload-${index}`}
                className="hidden"
                disabled={isSaving}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleImageSelect(index, file);
                    }
                }}
            />
            <label htmlFor={`quiz-image-upload-${index}`}>
                <div className="border-dashed border-[2px] rounded-lg h-[92px] w-32 flex items-center justify-center text-slate-500 hover:text-green-500 hover:scale-105 duration-100 cursor-pointer">
                    Upload
                </div>
            </label>
        </>
    );
};

export default QuestionImageUpload;
