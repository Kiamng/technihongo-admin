import axiosClient from "@/lib/axiosClient";
import { QuestionSchema } from "@/schema/question";
import { QuizQuestion } from "@/types/quiz-question";
import { z } from "zod";

const ENPOINT = {
    GET_BY_QUIZ_ID : '/quiz-question/quiz',
    DELETE : '/quiz-question/delete',
    CREATE : '/quiz-question/create',
    CREAT_WITH_QUESTION : '/quiz-question/create-new-question',
    UPDATE_ORDER : '/quiz-question/update-order'
}

export const getQuizQuestionByQuizId = async (quizId : number) : Promise<QuizQuestion[]> => {
    const response = await axiosClient.get(`${ENPOINT.GET_BY_QUIZ_ID}/${quizId}`)
    return response.data.data
}

export const deleteQuizQestion = async (quizQuestionId : number) => {
    const response = await axiosClient.delete(`${ENPOINT.DELETE}/${quizQuestionId}`)
    return response.data
}

export const createQuizQuestionWithQuestion = async (quizId : number, question:z.infer<typeof QuestionSchema>) => {
    const response = await axiosClient.post(ENPOINT.CREAT_WITH_QUESTION,
        {
            quizId : quizId,
            questionType : question.questionType,
            questionText : question.questionText,
            explanation : question.explanation,
            url : question.url,
            options :question.options
        }
    )
    return response.data
}

export const updateQuizQuestionOrder = async (quizId : number, newOrder : number[]) => {
    const response = await axiosClient.patch(`${ENPOINT.UPDATE_ORDER}/${quizId}`,
        {
            newQuizQuestionOrder : newOrder
        }
    )
    return response.data
}