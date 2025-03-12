/* eslint-disable @typescript-eslint/no-explicit-any */
// types/learningPath.ts
// import { Domain } from './domain';

// export type LearningPath = {
//     pathId: number;
//     title: string;
//     description: string;
//     domainId: number;
//     domain?: Domain; // Thêm domain optional để tương thích với API trả về
//     creatorId: number;
//     totalCourses: number;
//     public: boolean;
//     createdAt: string;
// };

// export enum LearningPathStatus {
//     false = "PRIVATE",
//     true = "PUBLIC"
//   }

// types/domain.ts
// types/domain.ts
export type Domain = {
    domainId: number;
    tag: string;
    name: string;
    description: string;
    createdAt: string;
};

// types/user.ts
export type User = {
    userId: number;
    userName: string;
    email: string;
    password: string;
    dob: string | null;
    uid: string | null;
    createdAt: string;
    lastLogin: string;
    profileImg: string | null;
    student: any | null; // Có thể thay bằng type Student nếu có
    active: boolean;
    verified: boolean;
};

// types/learningPath.ts


export type LearningPath = {
    pathId: number;
    title: string;
    description: string;
    domain?: Domain; // Đối tượng domain chứa domainId
    creator?: User;
    totalCourses: number;
    public: boolean;
    createdAt: string;
};

export enum LearningPathStatus {
    false = "PRIVATE",
    true = "PUBLIC"
}

// types/response.ts
export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type LearningPathsResponse = ApiResponse<LearningPath[]>;