import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Course } from "@/types/course";
import { EllipsisVertical, Trash, Eye } from "lucide-react";
import Link from "next/link";



interface CellActionProps {
    data: Course;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {


    return (
        <DropdownMenu>
            <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link href={`/course-management/${data.courseId}`} >
                    <DropdownMenuItem><Eye />View more</DropdownMenuItem>
                </Link>

                <DropdownMenuItem><Trash /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
