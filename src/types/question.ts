export type Question = { 
    questionId : number,
    questionType : "Single_choice"| "Multiple_choice",
    questionText : string,
    explanation : string,
    url : string,
    createdAt : Date,
    updatedAt : Date
}