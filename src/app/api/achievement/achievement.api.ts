import axiosClient from "@/lib/axiosClient";
import { Achievement } from "@/types/achievement";



const ENDPOINT = {
    GETALLACHIEVEMENT: "achievement/all",
    GETACHIEVEMENT: "",
};



export const getAllAchievement = async (token : string): Promise<Achievement[]> => {
  try {
      const response = await axiosClient.get(ENDPOINT.GETALLACHIEVEMENT,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
      );
      return response.data.data as Achievement[];
  } catch (error) {
      console.error("Error fetching Achievements:", error);
      throw error;
  }
};