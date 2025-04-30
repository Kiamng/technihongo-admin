import axiosClient from "@/lib/axiosClient";
import { QuizSchema } from "@/schema/quiz";
import { CreateQuizResponse, Quiz } from "@/types/quiz";
import { z } from "zod";

const ENDPOINT = {
    CREATE : '/quiz/create',
    GET_BY_ID : '/quiz',
    UPDATE : '/quiz/update',
    UPDATE_ACTIVE_STATUS : '/quiz/update-status'
}

export const createQuiz = async (token : string, values:z.infer<typeof QuizSchema>) : Promise<CreateQuizResponse> => {
    const response = await axiosClient.post(`${ENDPOINT.CREATE}`,
        {
            title: values.title,
            description : values.description,
            difficultyLevelId : values.difficultyLevelId,
            passingScore : values.passingScore,
            timeLimit : values.timeLimit,
            isPremium : values.isPremium
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

export const updateQuiz = async (token: string, quizId : number, values:z.infer<typeof QuizSchema>) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE}/${quizId}`,
        {
            title: values.title,
            description : values.description,
            difficultyLevelId : values.difficultyLevelId,
            passingScore : values.passingScore,
            timeLimit : values.timeLimit
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const updateQuizStatus = async (token : string, quizId : number, isPublic : boolean, isDeleted : boolean) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_ACTIVE_STATUS}/${quizId}`,
        {
            isPublic : isPublic,
            isDeleted : isDeleted
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}