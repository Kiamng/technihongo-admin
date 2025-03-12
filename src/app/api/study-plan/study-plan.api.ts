import axiosClient from "@/lib/axiosClient";
import { StudyPlanSchema } from "@/schema/study-plan";
import { StudyPlan } from "@/types/study-plan";
import { z } from "zod";

const ENDPOINT = {
    GET_STUDYPLAN_BY_COURSEID:'/study-plan/course',
    GET_STUDYPLAN_BY_ID: '/study-plan',
    CREATE_STUDYPLAN: '/study-plan/create',
    UPDATE_STUDYPLAN: '/study-plan/update',
    DELETE_STUDYPLAN: '/study-plan/delete'
};

export const getStudyPlanByCourseId = async (courseId : number, token : string) :Promise<StudyPlan[]> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_STUDYPLAN_BY_COURSEID}/${courseId}`,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data.data;
}

export const getStudyPlanById = async (token : string, studyplanId : number) => {
    const response = await axiosClient.get(`${ENDPOINT.GET_STUDYPLAN_BY_ID}/${studyplanId}`, 
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data.data
}

export const createStudyPlan = async (values : z.infer<typeof StudyPlanSchema>, courseId : number) => {
    const response = await axiosClient.post(ENDPOINT.CREATE_STUDYPLAN, {
            courseId : courseId,
            title : values.title,
            description : values.description,
            hoursPerDay : values.hoursPerDay
        }   
    )
    return response.data
}

export const updateStudyPlan = async (values: z.infer<typeof StudyPlanSchema>  ,studyplanId : number) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_STUDYPLAN}/${studyplanId}`,{
        title : values.title,
        description : values.description,
        hoursPerDay : values.hoursPerDay,
        isDefault : values.isDefault,
        isActive : values.isActive
    })
    return response.data
}

export const deleteStudyPlan = async ( studyplanId : number) => {
    const response = await axiosClient.delete(`${ENDPOINT.DELETE_STUDYPLAN}/${studyplanId}`
    )
    return response.data
}