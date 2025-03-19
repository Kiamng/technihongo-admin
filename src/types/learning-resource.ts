export type LearningResource = {
                resourceId: number,
                title: string,
                description: string,
                videoUrl: string,
                videoFilename: string,
                pdfUrl: string,
                pdfFilename: string,
                createdAt: Date,
                updatedAt: Date,
                public: boolean,
                premium: boolean
}

export type CreateLearningResourceResponse = {
    success : boolean,
    message : string,
    data : LearningResource
}