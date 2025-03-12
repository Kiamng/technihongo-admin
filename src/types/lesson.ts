import { StudyPlan } from "./study-plan"

export type Lesson = {
    lessonId: number,
    studyPlan: StudyPlan
    title: string,
    lessonOrder: number,
    createdAt: Date,
    updatedAt: Date
}

export type LessonList = {
    content : Lesson[],
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    last: boolean
}