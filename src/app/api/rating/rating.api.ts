import axiosClient from "@/lib/axiosClient";
import { Rating } from "@/types/rating";

const ENDPOINT = {
    GET_BY_ID :'/student-course-rating/getRating'
}

export const getRatingById = async (token: string, ratingId : number): Promise<Rating> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_BY_ID}/${ratingId}`,
        {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
    )
    return response.data.data
}