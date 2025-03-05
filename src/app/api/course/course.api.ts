import axiosClient from "@/lib/axiosClient";
import { CreateCourseSchema, updateCourseSchema } from "@/schema/course";
import { Course, CourseList } from "@/types/course";
import { z } from "zod";

const ENDPOINT = {
    ALL:'/course/all/paginated',
    CREATE_POST :'/course/create',
    GET_COURSE_BY_ID:'/course',
    PATCH_COURSE:'/course/update',
};

// export const getAllCourse = async (token : string) :Promise<Course[]> => {
//   const response = await axiosClient.get(ENDPOINT.ALL,{
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   return response.data.data as Course[];
// };

export const getAllCourse = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}) :Promise<CourseList> => {
  const params = new URLSearchParams();
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  
  const response = await axiosClient.get(`${ENDPOINT.ALL}?${params.toString()}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data as CourseList;
};

export const createCourse = async (values:z.infer<typeof CreateCourseSchema>, token : string) => {
  const response = await axiosClient.post(ENDPOINT.CREATE_POST,
    {
      
    title : values.title,
    description : values.description,
    domainId : values.domainId,
    difficultyLevelId : 1,
    attachmentUrl : "",
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

export const getCourseById = async (token : string, courseId : number) :Promise<Course> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_COURSE_BY_ID}/${courseId}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data as Course;
};

export const patchCourse = async (values:z.infer<typeof updateCourseSchema>, token : string, courseId : number) => {
  const response = await axiosClient.patch(`${ENDPOINT.PATCH_COURSE}/${courseId}`,
    {
    title : values.title,
    description : values.description,
    domainId : values.domainId,
    difficultyLevelId : 1,
    attachmentUrl : "",
    thumbnailUrl : values.thumbnailUrl,
    estimatedDuration : values.estimatedDuration,
    isPremium : values.isPremium,
    isPublic : values.isPublic
    },
    {
      headers: {
      Authorization: `Bearer ${token}`
    }
    }
  )
  return response.data
} 