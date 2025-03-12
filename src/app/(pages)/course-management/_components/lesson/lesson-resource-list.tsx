import { Button } from "@/components/ui/button";
import { LessonResource } from "@/types/lesson-resource";
import { Youtube, BookOpenCheck, Copy, SquarePen, Trash2 } from "lucide-react";

interface LessonResourceListProps {
    lessonResource: LessonResource;
}

// Mapping giữa type và thuộc tính tương ứng
const resourceTypeConfig = {
    Resource: { color: "#FD5673", icon: Youtube, getTitle: (res: LessonResource) => res.learningResource?.title },
    Quiz: { color: "#FFB600", icon: BookOpenCheck, getTitle: (res: LessonResource) => res.quiz?.title },
    FlashcardSet: { color: "#3AC6C6", icon: Copy, getTitle: (res: LessonResource) => res.systemFlashCardSet?.title }
};

const LessonResourceItem = ({ lessonResource }: LessonResourceListProps) => {
    const { color, icon: Icon, getTitle } = resourceTypeConfig[lessonResource.type];
    const title = getTitle(lessonResource) || "Untitled";

    return (
        <div className="px-3 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-base">
                <span>{lessonResource.typeOrder}</span>
                <div className="p-[6px] rounded-full" style={{ backgroundColor: `${color}1A`, color }}>
                    <Icon size={20} />
                </div>
                <span>{title}</span>
                <span className={lessonResource.active ? "text-green-500" : "text-red-500"}>
                    {lessonResource.active ? "Active" : "Not active"}
                </span>
            </div>
            <div className="flex space-x-2">
                <Button size="icon" variant="ghost"><SquarePen /></Button>
                <Button size="icon" variant="ghost"><Trash2 /></Button>
            </div>
        </div>
    );
};

export default LessonResourceItem;
