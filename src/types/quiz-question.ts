import { Question } from "./question";

export type QuizQuestion = {
    quizQuestionId : number,
    question : Question,
    questionOrder : number,
    createdAt : Date,
}