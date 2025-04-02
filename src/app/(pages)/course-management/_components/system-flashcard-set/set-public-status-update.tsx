import { SystemFlashcardSet } from "@/types/system-flashcard-set"

import { Dispatch, SetStateAction, useTransition } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateFlashcardSetPublicStatus } from "@/app/api/system-flashcard-set/system-flashcard-set.api";

interface SetPublicStatusUpdateProps {
    flashcardSetId: number,
    flashcardSet: SystemFlashcardSet,
    token: string,
    setFlashcardSet: Dispatch<SetStateAction<SystemFlashcardSet | undefined>>
}

const SetPublicStatusUpdate = ({ flashcardSetId, flashcardSet, token, setFlashcardSet }: SetPublicStatusUpdateProps) => {
    const [isUSPending, startUSTransition] = useTransition();

    const handleChangePublicStatus = async (publicStatus: string) => {
        if (!flashcardSet) {
            return;
        }
        startUSTransition(async () => {
            try {
                const response = await updateFlashcardSetPublicStatus(
                    token,
                    flashcardSetId,
                    publicStatus === 'true',
                );

                if (response.success) {
                    toast.success("Flashcard set public status updated successfully!");

                    setFlashcardSet((prevSet) => prevSet ? { ...prevSet, isPublic: publicStatus === 'true' } : prevSet);
                } else {
                    toast.error(response.message || "Failed to update flashcard set public status.");
                }
            } catch (error) {
                console.error("Error updating flashcard set public status:", error);
                toast.error("An error occurred while updating flashcard set public status.");
            }
        })
    };

    return (
        <div>
            <Select
                disabled={isUSPending}
                value={flashcardSet?.isPublic.toString()}
                onValueChange={(value) => handleChangePublicStatus(value)}>
                <SelectTrigger
                    className={flashcardSet?.isPublic
                        ? "bg-[#56D071] text-[#56D071] bg-opacity-10"
                        : "bg-[#FD5673] text-[#FD5673] bg-opacity-10"}>
                    <SelectValue
                        placeholder="Public" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">PUBLIC</SelectItem>
                    <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">PRIVATE</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default SetPublicStatusUpdate
