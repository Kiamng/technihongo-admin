import { createLessonResource, getExistingLessonResource } from "@/app/api/lesson-resource/lesson-resource.api";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LessonResource, LessonResourceList } from "@/types/lesson-resource";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddingLessonResourceItem from "./lesson-resource-add-list";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface AddExistingLessonResourcePopupProps {
    lessonId: number,
    defaultStudyPlanId: number,
    closeForm: (open: boolean) => void;
    setLessonResources: Dispatch<SetStateAction<Record<number, LessonResource[]>>>;
    token: string
}
const AddExistingLessonResourcePopup = ({ lessonId, defaultStudyPlanId, closeForm, setLessonResources, token }: AddExistingLessonResourcePopupProps) => {
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [loadedLessonResources, setLoadedLessonResources] = useState<LessonResource[]>();
    const [lessonResourcesPage, setLessonResourcesPage] = useState<LessonResourceList>();
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [type, setType] = useState<string>("")
    const [keyword, setKeyword] = useState<string>("")
    const [selectedLessonResources, setSelectedLessonResources] = useState<LessonResource[]>([])

    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const handleTypeChange = (value: string) => {
        if (value === "none") {
            setType("");
        } else {
            setType(value);
        }
        setCurrentPage(0);
    };

    const handleKeywordChange = (value: string) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        const newTimer = setTimeout(() => {
            setKeyword(value);
            setCurrentPage(0);
        }, 1000);

        setDebounceTimer(newTimer); // Store the new timeout
    }

    const loadMoreResources = async () => {
        try {
            setIsLoading(true);
            const data = await getExistingLessonResource({
                token: token,
                defaultStudyPlanId: defaultStudyPlanId,
                type: type,
                keyword: keyword,
                pageNo: currentPage + 1,
                pageSize: 5,
                sortBy: "typeOrder",
                sortDir: "asc"
            });
            setLoadedLessonResources((prevResources) => [
                ...(prevResources || []),
                ...data.content
            ]);
            setLessonResourcesPage(data);
            setCurrentPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching lesson resources");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getExistingLessonResource({
                    token: token,
                    defaultStudyPlanId: defaultStudyPlanId,
                    type: type,
                    keyword: keyword,
                    pageNo: 0,
                    pageSize: 5,
                    sortBy: "typeOrder",
                    sortDir: "asc"
                });
                setLoadedLessonResources(data.content);
                setLessonResourcesPage(data);
            } catch (error) {
                console.error(error);
                toast.error("Error fetching lesson resources");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [defaultStudyPlanId, type, keyword]);

    const handleAddLessonResource = (lessonResource: LessonResource) => {
        setSelectedLessonResources((prevResources) => [...prevResources, lessonResource]);
    }

    const handleRemoveLessonResource = (lessonResource: LessonResource) => {
        setSelectedLessonResources((prevResources) => prevResources.filter((resource) => resource.lessonResourceId !== lessonResource.lessonResourceId));
    }

    const handleSubmit = async () => {
        setIsPending(true);
        for (const lessonResource of selectedLessonResources) {
            await createLessonResource({
                token: token,
                lessonId: lessonId,
                resourceId: lessonResource.learningResource?.resourceId,
                systemSetId: lessonResource.systemFlashCardSet?.systemSetId,
                quizId: lessonResource.quiz?.quizId,
                active: lessonResource.active
            });
        }
        setLessonResources((prevResources) => ({
            ...prevResources,
            [lessonId]: [...(prevResources[lessonId] || []), ...selectedLessonResources]
        }));
        setIsPending(false);
        closeForm(false);
    }
    return (
        <>
            <DialogHeader className="w-full">
                <DialogTitle>Choose existing lesson resource:</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-row space-x-4">
                <div className="flex flex-col space-y-4 w-full">
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Input placeholder="Search" onChange={(e) => handleKeywordChange(e.target.value)} />
                        <Select onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="Quiz">Quiz</SelectItem>
                                <SelectItem value="FlashcardSet">FlashcardSet</SelectItem>
                                <SelectItem value="LearningResource">LearningResource</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {isLoading ? (
                        <div className="w-full flex justify-center items-center h-[300px]">
                            <LoaderCircle className="animate-spin" />
                        </div>
                    ) : (
                        <div className="w-full grid grid-cols-1 gap-1 overflow-y-auto h-[300px]">
                            {loadedLessonResources?.map((lessonResource) => (
                                <AddingLessonResourceItem handleAddLessonResource={handleAddLessonResource} handleRemoveLessonResource={handleRemoveLessonResource} isAdding={true} key={lessonResource.lessonResourceId} lessonResource={lessonResource} />
                            ))}
                        </div>
                    )}
                    {!lessonResourcesPage?.last &&
                        <Button disabled={isLoading} onClick={loadMoreResources}>Load more</Button>
                    }
                </div>
                <div className="flex flex-col space-y-4 w-full">
                    <div>Selected lesson resource:</div>
                    <Separator />
                    <div className="w-full flex flex-col space-y-1 overflow-y-auto h-[300px]">
                        {selectedLessonResources.map((lessonResource) => (
                            <AddingLessonResourceItem handleAddLessonResource={handleAddLessonResource} handleRemoveLessonResource={handleRemoveLessonResource} isAdding={false} key={lessonResource.lessonResourceId} lessonResource={lessonResource} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => closeForm(false)}>Cancel</Button>
                <Button disabled={isPending} onClick={handleSubmit}>
                    {isPending ? <><LoaderCircle className="animate-spin" /> Processing ...</> : "Continue"}
                </Button>
            </div>
        </>
    )
}

export default AddExistingLessonResourcePopup
