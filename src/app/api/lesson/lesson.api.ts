import axiosClient from "@/lib/axiosClient";
import { LessonList } from "@/types/lesson";

const ENDPOINT = {
    GET_LESSON_BY_STUDY_PLAN_ID : '/lesson/study-plan/paginated',
    CREATE_LESSON: '/lesson/create',
    UPDATE_LESSON: 'lesson/update',
    UPDATE_LESSON_ORDER : '/lesson/set-order',
    DELETE_LESSON: '/lesson/delete'
};

export const getLessonsByStudyPlanId= async ({
  token,
  studyPlanId,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword
}: {
  token: string;
  studyPlanId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string
}) :Promise<LessonList> => {
  const params = new URLSearchParams();
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (sortDir) params.append("sortDir", sortDir);
  if (keyword) params.append("keyword", keyword);
  
  const response = await axiosClient.get(`${ENDPOINT.GET_LESSON_BY_STUDY_PLAN_ID}/${studyPlanId}?${params.toString()}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data as LessonList;
};

export const createLesson = async (token : string, title : string, studyPlanId : number) => {
    const response = await axiosClient.post(ENDPOINT.CREATE_LESSON, {
            studyPlanId : studyPlanId,
            title : title
        },
        {
          headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
}

export const updateLesson = async (token : string ,title : string, lessonId : number) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_LESSON}/${lessonId}`, {
            title : title
        },
        {
          headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
}

export const updateLessonOrder = async (token : string , studyPlanId : number, lessonId : number, newOrder : number,) => {
  const response = await axiosClient.patch(`${ENDPOINT.UPDATE_LESSON_ORDER}/${studyPlanId}?lessonId=${lessonId}&newOrder=${newOrder}`,
    {},
    {
      headers: {
      Authorization: `Bearer ${token}`
    }
    }
  )
  return response.data
}

export const deleteLesson = async (token : string , lessonId : number) => {
  const response = await axiosClient.delete(`${ENDPOINT.DELETE_LESSON}/${lessonId}`,
    {
      headers: {
      Authorization: `Bearer ${token}`
    }
    }
  )
  return response.data
}