import { Flashcard } from "./flashcard"

export type StudentFlashcardSet = {
                studentId: number,
                studentSetId: number,
                userName: string,
                profileImg: string,
                title: string,
                description: string,
                totalViews: number,
                isPublic: boolean,
                isViolated: boolean,
                flashcards : Flashcard[]
                createdAt: Date
}