import axiosClient from "@/lib/axiosClient";
import { LessonList } from "@/types/lesson";

const ENDPOINT = {
    GET_LESSON_BY_STUDY_PLAN_ID : '/lesson/study-plan/paginated',
    CREATE_LESSON: '/lesson/create',
    UPDATE_LESSON: 'lesson/update'
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

export const createLesson = async (title : string, studyPlanId : number) => {
    const response = await axiosClient.post(ENDPOINT.CREATE_LESSON, {
            studyPlanId : studyPlanId,
            title : title
        }   
    )
    return response.data
}

export const updateLesson = async (title : string, lessonId : number) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_LESSON}/${lessonId}`, {
            title : title
        }   
    )
    return response.data
}