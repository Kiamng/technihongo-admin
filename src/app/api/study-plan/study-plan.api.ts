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

export const getStudyPlanById = async (token : string, studyplanId : string) => {
    const response = await axiosClient.post(`${ENDPOINT.GET_STUDYPLAN_BY_ID}/${studyplanId}`, 
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
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

export const updateStudyPlan = async (studyplanId : string) => {
    const response = await axiosClient.post(`${ENDPOINT.DELETE_STUDYPLAN}/${studyplanId}`)
    return response.data
}

export const deleteStudyPlan = async (values : z.infer<typeof StudyPlanSchema>, courseId : string) => {
    const response = await axiosClient.post(ENDPOINT.CREATE_STUDYPLAN, {
            courseId : courseId,
            title : values.title,
            description : values.description,
            hoursPerDay : values.hoursPerDay
        }   
    )
    return response.data
}