import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { Eye } from "lucide-react";
import Link from "next/link";



interface CellActionProps {
    data: Course;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {


    return (
        <Link href={`/course-management/${data.courseId}`} >
            <Button><Eye />Xem chi tiết</Button>
        </Link>
    );
};
