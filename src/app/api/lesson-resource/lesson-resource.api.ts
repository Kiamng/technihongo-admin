import axiosClient from "@/lib/axiosClient";
import { LessonResource, LessonResourceList } from "@/types/lesson-resource";

const ENDPOINT = {
    GET_LESSON_RESOURCE_BY_LESSON_ID : '/lesson-resource/lesson',
    DELETE : '/lesson-resource/delete',
    CREATE : '/lesson-resource/create',
    UPDATE_STATUS : '/lesson-resource/update',
    UPDATE_LESSON_RESOURCE_ORDER : '/lesson-resource/update-order/',
    GET_EXISTING_LESSON_RESOURCE : '/lesson-resource/study-plan'
};

export const getLessonResourceByLessonId = async (token : string, lessonId : number) : Promise<LessonResource[]> => {
    const response = await axiosClient.get(`${ENDPOINT.GET_LESSON_RESOURCE_BY_LESSON_ID}/${lessonId}`, {
        headers: {
            Authorization: `Bearer ${token}`
            }
    })
    return response.data.data
}

export const deleteLessonResourceById = async (lessonResourceId : number, token : string) => {
    const response = await axiosClient.delete(`${ENDPOINT.DELETE}/${lessonResourceId}`,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
        return response.data
}

export const createLessonResource = async (
    {
        token,
        lessonId,
        resourceId,
        systemSetId,
        quizId,
        active
    } : 
    {
        token : string,
        lessonId : number,
        resourceId? : number,
        systemSetId? : number,
        quizId? : number,
        active: boolean
    }
) => {
    const response = await axiosClient.post(ENDPOINT.CREATE, {
        token: token,
        lessonId : lessonId,
        resourceId : resourceId,
        systemSetId: systemSetId,
        quizId: quizId,
        active : active
    },
    {
        headers: {
      Authorization: `Bearer ${token}`
    }
    }
)
    return response.data
}

export const updateLessonResourceStatus = async (lessonResourceId : number, status : boolean ) => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_STATUS}/${lessonResourceId}`,
        {
            isActive : status
        }
    )
        return response.data
}

export const updateLessonResourceOrder = async (lessonId : number, newOrder: number[], token : string ) => {
    const response = await axiosClient.patch (`${ENDPOINT.UPDATE_LESSON_RESOURCE_ORDER}/${lessonId}`,
        {
            newLessonResourceOrder : newOrder
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const getExistingLessonResource = async (
    {token,
    defaultStudyPlanId, 
    type, 
    keyword, 
    pageNo, 
    pageSize, 
    sortBy, 
    sortDir} : { 
        token : string, 
        defaultStudyPlanId : number, 
        type? : string, 
        keyword?:string, 
        pageNo?: number,
        pageSize? : number,
        sortBy? : string,
        sortDir? : string
    }
):Promise<LessonResourceList> => {
    const params = new URLSearchParams();
    params.append("studyPlanId", defaultStudyPlanId.toString());
    if (type) params.append("type", type);
    if (keyword) params.append("keyword", keyword);
    if (pageNo) params.append("pageNo", pageNo.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDir) params.append("sortDir", sortDir);
    const response = await axiosClient.get(`${ENDPOINT.GET_EXISTING_LESSON_RESOURCE}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data.data
}