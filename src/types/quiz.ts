import { DifficultyLevel } from "./difficulty-level"

export type Quiz = {
                quizId: number,
                title: string,
                description: string,
                difficultyLevel : DifficultyLevel
                totalQuestions: number,
                passingScore: number,
                createdAt: Date,
                updatedAt: Date,
                public: boolean,
                deleted: boolean
            }

export type CreateQuizResponse = {
    success : boolean,
    message : string,
    data : Quiz
}