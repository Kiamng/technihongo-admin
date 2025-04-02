import axiosClient from "@/lib/axiosClient";
import { LearningResourceSchema } from "@/schema/learning-resource";
import { CreateLearningResourceResponse, LearningResource } from "@/types/learning-resource";
import { z } from "zod";

const ENDPOINT = {
    GET_LEARNING_RESOURCE_BY_ID : '/learning-resource',
    UPDATE_LEARNING_RESOURCE : '/learning-resource/update',
    UPDATE_LEARNING_RESOURCE_STATUS : '/learning-resource/update-status/',
    CREATE_LEARNING_RESOURCE_STATUS: '/learning-resource/create',
    UPDATE_PUBLIC_STATUS : '/learning-resource/update-status'
}

export const getLearningResourceById = async (token : string, learningResourceId : number) : Promise<LearningResource> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_LEARNING_RESOURCE_BY_ID}/${learningResourceId}`,{
            headers: {
                    Authorization: `Bearer ${token}`
                    }
    }
    )
    return response.data.data
}

export const updateLearningResource = async (token : string, learningResourceId : number, values : z.infer<typeof LearningResourceSchema>) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_LEARNING_RESOURCE}/${learningResourceId}`,
        {
            title : values.title,
            description : values.description,
            videoUrl : values.videoUrl,
            videoFilename : values.videoFilename,
            pdfUrl : values.pdfUrl,
            pdfFilename : values.pdfFilename,
            isPremium : values.premium
        },
        {
            headers: {
                    Authorization: `Bearer ${token}`
                    }
        }
    )
    return response.data
}

export const createLearningResource = async (token : string, values : z.infer<typeof LearningResourceSchema>) : Promise<CreateLearningResourceResponse> => {
    const response = await axiosClient.post(ENDPOINT.CREATE_LEARNING_RESOURCE_STATUS,
        {
            title : values.title,
            description : values.description,
            videoUrl : values.videoUrl,
            videoFilename : values.videoFilename,
            pdfUrl : values.pdfUrl,
            pdfFilename : values.pdfFilename,
            isPremium : values.premium
        },
        {
            headers: {
                    Authorization: `Bearer ${token}`
                    }
        }
    )
    return response.data
}

export const updateLearningResourceStatus = async (token : string, learningResourceId : number, isPublic : boolean) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_PUBLIC_STATUS}/${learningResourceId}`,
        {
            isPublic : isPublic,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}