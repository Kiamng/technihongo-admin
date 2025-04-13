import { DifficultyLevel } from "./difficulty-level"

export type Quiz = {
                quizId: number,
                title: string,
                description: string,
                difficultyLevel : DifficultyLevel
                totalQuestions: number,
                passingScore: number,
                timeLimit: number,
                createdAt: Date,
                updatedAt: Date,
                hasAttempt : boolean,
                public: boolean,
                premium : boolean,
                deleted: boolean
            }

export type CreateQuizResponse = {
    success : boolean,
    message : string,
    data : Quiz
}