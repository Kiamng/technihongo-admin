import axiosClient from "@/lib/axiosClient";
import { StudentFlashcardSet } from "@/types/student-flashcard-set";

const ENDPOING = {
    GET_SET_BY_ID : '/student-flashcard-set/getAllFlashcardOfSet'
}
export const getStuSetById = async (token : string, setId : number):Promise<StudentFlashcardSet> => {
    const response = await axiosClient.get(`${ENDPOING.GET_SET_BY_ID}/${setId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}