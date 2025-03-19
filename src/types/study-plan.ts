export type StudyPlan = {
    studyPlanId : number,
    course : {
        courseId : number,
        title : string,
        premium : boolean
    }
    title: string,
    description: string,
    hoursPerDay: number,
    active: boolean,
    createdAt: Date,
    default: boolean
}