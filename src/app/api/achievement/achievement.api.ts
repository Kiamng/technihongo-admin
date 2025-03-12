import axiosClient from "@/lib/axiosClient";
import { Achievement } from "@/types/achievement";



const ENDPOINT = {
    GETALLACHIEVEMENT: "achievement/all",
    GETACHIEVEMENT: "",
};



export const getAllAchievement = async (): Promise<Achievement[]> => {
  console.log("Fetching from:", axiosClient.defaults.baseURL + ENDPOINT.GETALLACHIEVEMENT);
  
  try {
      const response = await axiosClient.get(ENDPOINT.GETALLACHIEVEMENT);
      console.log("Fetched Data:", response.data); 
      return response.data.data as Achievement[];
  } catch (error) {
      console.error("Error fetching Achievements:", error);
      throw error;
  }
};