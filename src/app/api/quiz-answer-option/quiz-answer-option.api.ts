import axiosClient from "@/lib/axiosClient";
import { QuizAnswerOption } from "@/types/quiz-answer-option";

const ENDPOINT = {
    GET_BY_QUESTION_ID: '/option/question',
}

export const getAnswersByQuestionId = async (token : string , questionId : number) : Promise<QuizAnswerOption[]> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_BY_QUESTION_ID}/${questionId}`, 
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data.data
}