import { Separator } from "@/components/ui/separator"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { FieldArrayWithId } from "react-hook-form";

interface UpdateFlashcardOrderProps {
    fields: FieldArrayWithId<{
        flashcards: {
            flashcardId: number | null;
            japaneseDefinition: string;
            vietEngTranslation: string;
            imageUrl: string | null;
            cardOrder: number | null;
        }[];
    }, "flashcards", "id">[]
    handleDragEnd: (result: DropResult) => void
}
const UpdateFlashcardOrder = ({ fields, handleDragEnd }: UpdateFlashcardOrderProps) => {
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="question-list" type="question">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-4"
                    >
                        {fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex flex-col space-y-5 p-5 rounded-lg border-[1px] shadow-md hover:scale-105 duration-100"
                                    >
                                        <div className="text-lg font-semibold text-slate-500">{index + 1}</div>
                                        <Separator />
                                        <div className="flex flex-row text-2xl font-bold">
                                            <div className="flex-1">
                                                {field.japaneseDefinition}
                                            </div>
                                            <div className="flex-1 text-slate-500">
                                                {field.vietEngTranslation}
                                            </div>
                                            {field.imageUrl &&
                                                <div
                                                    className={`border-dashed border-[2px] rounded-lg h-[92px] w-32 flex justify-end text-slate-500`}

                                                    style={{
                                                        backgroundImage: `url(${field.imageUrl})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center"
                                                    }}
                                                >
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default UpdateFlashcardOrder
