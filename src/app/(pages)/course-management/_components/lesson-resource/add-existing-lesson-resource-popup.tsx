import { Dispatch, SetStateAction } from "react"

interface AddExistingLessonResourcePopupProps {
    lessonId: number,
    setOpenCreateResourceForm: Dispatch<SetStateAction<boolean>>
    fetchLessons: () => Promise<void>;
}
const AddExistingLessonResourcePopup = ({ lessonId, fetchLessons, setOpenCreateResourceForm }: AddExistingLessonResourcePopupProps) => {
    return (
        <div>

        </div>
    )
}

export default AddExistingLessonResourcePopup
