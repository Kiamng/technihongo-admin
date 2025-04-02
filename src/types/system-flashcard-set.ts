import { Flashcard } from "./flashcard"

export type SystemFlashcardSet = {
                systemSetId: number,
                title: string,
                description: string,
                difficultyLevel : string,
                isPublic: boolean,
                isPremium: boolean,
                flashcards : Flashcard[]
}

export type CreateSystemFlashcardSetResponse = {
    success : boolean,
    message : string,
    data : SystemFlashcardSet
}