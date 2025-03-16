import axiosClient from "@/lib/axiosClient";
import { LearningResourceSchema } from "@/schema/learning-resource";
import { LearningResource } from "@/types/learning-resource";
import { z } from "zod";

const ENDPOINT = {
    GET_LEARNING_RESOURCE_BY_ID : '/learning-resource/',
    UPDATE_LEARNING_RESOURCE : '/learning-resource/update',
    UPDATE_LEARNING_RESOURCE_STATUS : '/learning-resource/update-status/',
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
            domainId : values.domainId,
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