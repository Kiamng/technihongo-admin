'use client'

import FlashcardList from "@/app/(pages)/course-management/_components/system-flashcard-set/flashcard/flashcard-list-review";
import FlashcardsFormRender from "@/app/(pages)/course-management/_components/system-flashcard-set/flashcard/flashcards-edit-form";
import SetPublicStatusUpdate from "@/app/(pages)/course-management/_components/system-flashcard-set/set-public-status-update";
import SetUpdateForm from "@/app/(pages)/course-management/_components/system-flashcard-set/set-update-form";
import { getSysFlashcardSetById } from "@/app/api/system-flashcard-set/system-flashcard-set.api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SystemFlashcardSet } from "@/types/system-flashcard-set";
import { Copy, CornerDownLeft, LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const EditFlashcardSetPage = () => {
    const params = useParams(); // Lấy dữ liệu từ URL
    const { courseId, studyPlanId, flashcardSetId } = params;
    const { data: session } = useSession()

    const [flashcardSet, setFlashcardSet] = useState<SystemFlashcardSet>();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchSet = async () => {
        setIsLoading(true);
        try {
            const response = await getSysFlashcardSetById(session?.user.token as string, parseInt(flashcardSetId as string, 10));
            console.log(response);

            setFlashcardSet(response);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load flashcard set.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!session?.user?.token) return;
        fetchSet();
    }, [flashcardSetId, session?.user.token])
    return (
        <div className="w-full flex flex-col space-y-6">
            <Link href={`/course-management/${courseId}/study-plan/${studyPlanId}`}>
                <Button variant="outline">
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Back</span>
                </Button>
            </Link>
            <div className=" flex flex-row space-x-6 items-center">
                <div className="flex flex-row space-x-4 items-center">
                    <div className="rounded-full p-2 bg-[#3AC6C6] bg-opacity-10">
                        <Copy className="text-[#3AC6C6]" size={28} />
                    </div>
                    <span className="text-4xl font-bold ">Edit Flashcard Set Information</span>
                </div>
                {flashcardSet ?
                    <SetPublicStatusUpdate
                        flashcardSetId={parseInt(flashcardSetId as string, 10)}
                        flashcardSet={flashcardSet}
                        setFlashcardSet={setFlashcardSet}
                        token={session?.user.token as string} />
                    :
                    <LoaderCircle className="animate-spin" />
                }
            </div>
            {flashcardSet ?
                <SetUpdateForm
                    flashcardSetId={parseInt(flashcardSetId as string, 10)}
                    flashcardSet={flashcardSet}
                    isLoading={isLoading}
                    token={session?.user.token as string} />
                :
                <Skeleton className="w-full h-[500px]" />
            }
            <Separator />
            {flashcardSet?.flashcards &&
                <FlashcardList FlashcardList={flashcardSet.flashcards} />
            }
            {flashcardSet &&
                <FlashcardsFormRender fetchSet={fetchSet} initialData={flashcardSet?.flashcards} token={session?.user.token as string} flashcardSetId={parseInt(flashcardSetId as string, 10)} />
            }
        </div>
    )
}

export default EditFlashcardSetPage
