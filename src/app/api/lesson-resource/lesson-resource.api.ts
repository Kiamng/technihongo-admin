import axiosClient from "@/lib/axiosClient";
import { LessonResource } from "@/types/lesson-resource";

const ENDPOINT = {
    GET_LESSON_RESOURCE_BY_LESSON_ID : '/lesson-resource/lesson',
    DELETE : '/lesson-resource/delete',
    CREATE : '/lesson-resource/create',
    UPDATE_STATUS : '/lesson-resource/update',
    UPDATE_LESSON_RESOURCE_ORDER : '/lesson-resource/update-order/'
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
        token,
        lessonId,
        resourceId,
        systemSetId,
        quizId
    } : 
    {
        token : string,
        lessonId : number,
        resourceId? : number,
        systemSetId? : number,
        quizId? : number,
    }
) => {
    const response = await axiosClient.post(ENDPOINT.CREATE, {
        token: token,
        lessonId : lessonId,
        resourceId : resourceId,
        systemSetId: systemSetId,
        quizId: quizId
    },
    {
        headers: {
      Authorization: `Bearer ${token}`
    }
    }
)
    return response.data
}

export const updateLessonResourceStatus = async (lessonResourceId : number, status : boolean ) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_STATUS}/${lessonResourceId}`,
        {
            isActive : status
        }
    )
        return response.data
}

export const updateLessonResourceOrder = async (lessonId : number, newOrder: number[] ) => {
    const response = await axiosClient.patch (`${ENDPOINT.UPDATE_LESSON_RESOURCE_ORDER}/${lessonId}`,
        {
            newLessonResourceOrder : newOrder
        }
    )
    return response.data
}