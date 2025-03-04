
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Course } from "@/types/course";
import { EllipsisVertical, Edit, Trash, Eye } from "lucide-react";



interface CellActionProps {
    data: Course;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {



    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem><Eye />View more</DropdownMenuItem>
                    <DropdownMenuItem><Edit />Update</DropdownMenuItem>
                    <DropdownMenuItem><Trash /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>




        </>
    );
};
