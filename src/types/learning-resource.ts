import { Domain } from "./domain"

export type LearningResource = {
                resourceId: number,
                title: string,
                description: string,
                domain : Domain,
                videoUrl: string,
                videoFilename: string,
                pdfUrl: string,
                pdfFilename: string,
                createdAt: Date,
                updatedAt: Date,
                public: boolean,
                premium: boolean
}