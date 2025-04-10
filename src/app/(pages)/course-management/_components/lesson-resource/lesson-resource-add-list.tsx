
import { Button } from "@/components/ui/button";
import { LessonResource } from "@/types/lesson-resource";
import { Youtube, BookOpenCheck, Copy, Plus, Minus } from "lucide-react";

interface LessonResourceListProps {
    lessonResource: LessonResource;
    handleAddLessonResource: (lessonResource: LessonResource) => void
    handleRemoveLessonResource: (lessonResource: LessonResource) => void
    isAdding: boolean
}

// Mapping giữa type và thuộc tính tương ứng
const resourceTypeConfig = {
    LearningResource: {
        color: "#FD5673", icon: Youtube,
        getTitle: (res: LessonResource) => res.learningResource?.title,
    },
    Quiz: {
        color: "#FFB600", icon: BookOpenCheck,
        getTitle: (res: LessonResource) => res.quiz?.title,
    },

    FlashcardSet: {
        color: "#3AC6C6", icon: Copy,
        getTitle: (res: LessonResource) => res.systemFlashCardSet?.title,
    }
};

const AddingLessonResourceItem = ({ lessonResource, handleAddLessonResource, handleRemoveLessonResource, isAdding }: LessonResourceListProps) => {
    const resource = resourceTypeConfig[lessonResource.type];
    if (!resource) {
        console.error(`Unsupported lesson resource type: ${lessonResource.type}`);
        return null;
    }

    const { color, icon: Icon, getTitle } = resource;
    const title = getTitle(lessonResource) || "Untitled";

    return (
        <div className="p-3 flex justify-between items-center hover:bg-slate-50 rounded-2xl">
            <div className="flex items-center space-x-3 text-base">
                <div className="p-[6px] rounded-full" style={{ backgroundColor: `${color}1A`, color }}>
                    <Icon size={20} />
                </div>
                <span>{title}</span>
                <div className={`bg-opacity-10 px-3 py-[6px] text-base rounded-lg ${lessonResource.active ? "bg-[#56D071] text-[#56D071]" : "bg-[#FD5673] text-[#FD5673]"}`}>
                    {lessonResource.active ? "ACTIVE" : "INACTIVE"}
                </div>
            </div>
            {isAdding ? (
                <div className="flex space-x-2">
                    <Button size="icon" variant="outline" onClick={() => handleAddLessonResource(lessonResource)}><Plus /></Button>
                </div >
            ) : (
                <div className="flex space-x-2">
                    <Button size="icon" variant="outline" onClick={() => handleRemoveLessonResource(lessonResource)}><Minus /></Button>
                </div >
            )}
        </div>
    );
};

export default AddingLessonResourceItem;
