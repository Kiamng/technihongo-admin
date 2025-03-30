import axiosClient from "@/lib/axiosClient";
import { QuestionSchema } from "@/schema/question";
import { Question } from "@/types/question";
import { z } from "zod";

const ENDPOINT = {
    CREATE_QUESTION_WITH_OPTIONS : '/question/options/create',
    UPDATE_QUESTION_WITH_OPTIONS : '/question/options/update'
}

export const createQuestionWithOptions = async (values:z.infer<typeof QuestionSchema>) :Promise<Question> => {
    const resposne = await axiosClient.post(ENDPOINT.CREATE_QUESTION_WITH_OPTIONS,
        {
            questionText : values.questionText,
            explanation : values.explanation,
            url : "",
            options :values.options
        }
    )
    return resposne.data.data
}

export const updateQuestionWithOptions = async (token : string, questionId : number, values:z.infer<typeof QuestionSchema>) => {
    const resposne = await axiosClient.patch(`${ENDPOINT.UPDATE_QUESTION_WITH_OPTIONS}/${questionId}`,
        {
            questionType : values.questionType,
            questionText : values.questionText,
            explanation : values.explanation,
            url : values.url,
            options :values.options
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return resposne.data
}