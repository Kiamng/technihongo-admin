import axiosClient from "@/lib/axiosClient";
import { CreateCourseSchema } from "@/schema/course";
import { Course } from "@/types/course";
import { z } from "zod";

const ENDPOINT = {
    ALL:'/course/all',
    CREATE_POST :'/course/create'
};

export const getAllCourse = async (token : string) :Promise<Course[]> => {
  const response = await axiosClient.get(ENDPOINT.ALL,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data as Course[];
};

export const createCourse = async (values:z.infer<typeof CreateCourseSchema>, token : string) => {
  const response = await axiosClient.post(ENDPOINT.CREATE_POST,
    {
      
    title : values.title,
    description : values.description,
    domainId : values.domainId,
    difficultyLevelId : 1,
    attachmentUrl : "https://",
    thumbnailUrl : values.thumbnailUrl,
    estimatedDuration : values.estimatedDuration,
    isPremium : false
    },
    {
      headers: {
      Authorization: `Bearer ${token}`
    }
    }
  )
  return response.data
} 


