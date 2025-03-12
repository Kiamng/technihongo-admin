export type Quiz = {
                quizId: number,
                title: string,
                description: string,
                totalQuestions: number,
                passingScore: number,
                createdAt: Date,
                updatedAt: Date,
                public: boolean,
                deleted: boolean
            }