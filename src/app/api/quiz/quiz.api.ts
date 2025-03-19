import axiosClient from "@/lib/axiosClient";
import { QuizSchema } from "@/schema/quiz";
import { CreateQuizResponse, Quiz } from "@/types/quiz";
import { z } from "zod";

const ENDPOINT = {
    CREATE : '/quiz/create',
    GET_BY_ID : '/quiz'
}

export const createQuiz = async (token : string, values:z.infer<typeof QuizSchema>) : Promise<CreateQuizResponse> => {
    const response = await axiosClient.post(`${ENDPOINT.CREATE}`,
        {
            title: values.title,
            description : values.description,
            difficultyLevelId : values.difficultyLevelId,
            passingScore : values.passingScore
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const getQuizById = async (token : string, quizId : number) : Promise<Quiz> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_BY_ID}/${quizId}`,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data.data
}