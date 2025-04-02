import { DifficultyLevel } from "./difficulty-level"

export type StudyPlan = {
    studyPlanId : number,
    course : {
        courseId : number,
        title : string,
        premium : boolean,
        difficultyLevel : DifficultyLevel
    }
    title: string,
    description: string,
    hoursPerDay: number,
    active: boolean,
    createdAt: Date,
    default: boolean
}