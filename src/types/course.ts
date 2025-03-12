
import { User } from "./user";
import { DifficultyLevel } from "./difficulty-level";
import { Domain } from "./domain";

export type Course = {
    courseId: number;
    title: string;
    description: string;
    creator: User;
    domain: Domain;
    difficultyLevel: DifficultyLevel;
    attachmentUrl: string;
    thumbnailUrl: string;
    estimatedDuration: string;
    enrollmentCount: number;
    createdAt: string;
    updateAt: string | null;
    publicStatus: boolean;
    premium: boolean;
};

export type CourseList = {
    content : Course[],
    pageNo: number,
        pageSize: number,
        totalElements: number,
        totalPages: number,
        last: boolean
}