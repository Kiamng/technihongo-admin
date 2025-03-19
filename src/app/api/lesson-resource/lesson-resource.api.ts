import axiosClient from "@/lib/axiosClient";
import { LessonResource } from "@/types/lesson-resource";

const ENDPOINT = {
    GET_LESSON_RESOURCE_BY_LESSON_ID : '/lesson-resource/lesson',
    DELETE : '/lesson-resource/delete',
    CREATE : '/lesson-resource/create'
};

export const getLessonResourceByLessonId = async (token : string, lessonId : number) : Promise<LessonResource[]> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_LESSON_RESOURCE_BY_LESSON_ID}/${lessonId}`, {
        headers: {
            Authorization: `Bearer ${token}`
            }
    })
    return response.data.data
}

export const deleteLessonResourceById = async (lessonResourceId : number) => {
    const response = await axiosClient.delete(`${ENDPOINT.DELETE}/${lessonResourceId}`)
        return response.data
}

export const createLessonResource = async (
    {
        lessonId,
        resourceId,
        systemSetId,
        quizId
    } : 
    {
        lessonId : number,
        resourceId? : number,
        systemSetId? : number,
        quizId? : number,
    }
) => {
    const response = await axiosClient.post(ENDPOINT.CREATE, {
        lessonId : lessonId,
        resourceId : resourceId,
        systemSetId: systemSetId,
        quizId: quizId
    })
    return response.data
}