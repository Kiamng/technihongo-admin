export type StudyPlan = {
    studyPlanId : string,
    title: string,
    description: string,
    hoursPerDay: number,
    active: boolean,
    createdAt: Date,
    default: boolean
}