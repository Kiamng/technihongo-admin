'use client'

import { useParams } from "next/navigation";


const EditFlashcardSetPage = () => {
    const params = useParams(); // Lấy dữ liệu từ URL
    const { courseId, studyPlanId, flashcardSetId } = params;

    return (
        <div>
            {flashcardSetId}
        </div>
    )
}

export default EditFlashcardSetPage
