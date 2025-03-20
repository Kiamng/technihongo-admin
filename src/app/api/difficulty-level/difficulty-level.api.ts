
import axiosClient from "@/lib/axiosClient";
import { DifficultyLevel } from "@/types/difficulty-level";

const ENDPOINT = {
    GET_ALL: '/difficulty-level/all',
    GET_BY_TAG: '/difficulty-level/tag'
}

export const getAllDifficultyLevel = async (): Promise<DifficultyLevel[]> => {
    const response = await axiosClient.get(ENDPOINT.GET_ALL)
    return response.data.data
}

export const getDifficultyLevelByTag = async (tag: string): Promise<DifficultyLevel> => {
    try {
        const response = await axiosClient.get(`/difficulty-level/tag/${tag}`);
        console.log("API Response:", response); // Debug log
        return response.data.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};