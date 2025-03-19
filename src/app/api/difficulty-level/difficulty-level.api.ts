import axiosClient from "@/lib/axiosClient";
import { DifficultyLevel } from "@/types/difficulty-level";

const ENDPOINT = {
    GET_ALL : '/difficulty-level/all'
}

export const getAllDifficultyLevel = async () : Promise<DifficultyLevel[]> => {
    const response = await axiosClient.get(ENDPOINT.GET_ALL)
    return response.data.data
}