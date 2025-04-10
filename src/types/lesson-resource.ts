import { LearningResource } from "./learning-resource"
import { Quiz } from "./quiz"
import { SystemFlashcardSet } from "./system-flashcard-set"

export type LessonResource = {
    lessonResourceId : number,
    type : "Quiz" | "FlashcardSet" | "LearningResource",
    typeOrder : number,
    learningResource : LearningResource | null,
    systemFlashCardSet : SystemFlashcardSet | null,
    quiz : Quiz | null,
    createdAt: Date,
    updatedAt: Date,
    active: boolean
}

export type LessonResourceList = {
    content : LessonResource[],
    pageNo : number,
    pageSize : number,
    totalElements : number,
    totalPages : number,
    last : boolean
}
