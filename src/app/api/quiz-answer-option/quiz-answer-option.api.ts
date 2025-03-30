import axiosClient from "@/lib/axiosClient";
import { QuizAnswerOption } from "@/types/quiz-answer-option";

const ENDPOINT = {
    GET_BY_QUESTION_ID: '/option/question',
}

export const getAnswersByQuestionId = async (questionId : number) : Promise<QuizAnswerOption[]> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_BY_QUESTION_ID}/${questionId}`)
    return response.data.data
}