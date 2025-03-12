import axiosClient from "@/lib/axiosClient";
import { LessonResource } from "@/types/lesson-resource";

const ENDPOINT = {
    GET_LESSON_RESOURCE_BY_LESSON_ID : '/lesson-resource/lesson',
};

export const getLessonResourceByLessonId = async (token : string, lessonId : number) : Promise<LessonResource[]> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_LESSON_RESOURCE_BY_LESSON_ID}/${lessonId}`, {
        headers: {
            Authorization: `Bearer ${token}`
            }
    })
    return response.data.data
}