import axiosClient from "@/lib/axiosClient";
import { CreateCourseSchema, updateCourseSchema } from "@/schema/course";
import { Course, CourseList } from "@/types/course";
import { z } from "zod";

const ENDPOINT = {
    ALL:'/course/all/paginated',
    CREATE_POST :'/course/create',
    GET_COURSE_BY_ID:'/course',
    PATCH_COURSE:'/course/update',
    UPDATE_COURSE_PUBLIC_STATUS : '/course/update-status'
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
  sortDir,
  keyword,
  domainId,
  difficultyLevelId
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  keyword? : string;
  domainId? : number | null;
  difficultyLevelId? : number | null
}) :Promise<CourseList> => {
  const params = new URLSearchParams();
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  if (keyword) params.append("keyword", keyword);
  if (domainId) params.append("domainId", domainId.toString());
  if (difficultyLevelId) params.append("difficultyLevelId", difficultyLevelId.toString());
  
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
    difficultyLevelId : values.difficultyLevelId,
    attachmentUrl : "",
    thumbnailUrl : values.thumbnailUrl,
    estimatedDuration : values.estimatedDuration,
    isPremium : values.isPremium
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
    difficultyLevelId : values.difficultyLevelId,
    attachmentUrl : "",
    thumbnailUrl : values.thumbnailUrl,
    estimatedDuration : values.estimatedDuration,
    },
    {
      headers: {
      Authorization: `Bearer ${token}`
    }
    }
  )
  return response.data
} 

export const updateCoursePublicStatus = async (token: string, courseId: number, activeStatus :boolean) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_COURSE_PUBLIC_STATUS}/${courseId}`,
        {
            isPublic: activeStatus
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}