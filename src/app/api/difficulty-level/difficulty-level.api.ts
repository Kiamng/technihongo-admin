
import axiosClient from "@/lib/axiosClient";
import { DifficultyLevel } from "@/types/difficulty-level";

const ENDPOINT = {
    GET_ALL: '/difficulty-level/all',
    GET_BY_TAG: '/difficulty-level/tag'
}

export const getAllDifficultyLevel = async (token : string): Promise<DifficultyLevel[]> => {
    const response = await axiosClient.get(ENDPOINT.GET_ALL,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data.data
}

export const getDifficultyLevelByTag = async (token : string ,tag: string): Promise<DifficultyLevel> => {
    try {
        const response = await axiosClient.get(`/difficulty-level/tag/${tag}`,
            {
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};