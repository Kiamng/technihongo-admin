/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/lib/axiosClient";
import { Course, PathCourseListResponse } from "@/types/path-course";
import axios from "axios";
import { z } from "zod";

const ENDPOINT = {
  GET_PATH_COURSES_BY_LEARNING_PATH_ID: "path-course/learning-path/{pathId}",
  CREATE_PATH_COURSE: "/path-course/create",
  UPDATE_PATH_COURSE_ORDER: "/path-course/update-order/{pathId}",
  GET_ALL_COURSES: `https://technihongo-hueze5fkd5g2f7bk.centralindia-01.azurewebsites.net/api/course/all`,
  GET_COURSES_BY_PARENT_DOMAIN: `https://technihongo-hueze5fkd5g2f7bk.centralindia-01.azurewebsites.net/api/course/domain/{parentDomainId}`,
  DELETE_PATH_COURSE: "/path-course/delete/{id}",
};

const BASE_URL = "https://technihongo-hueze5fkd5g2f7bk.centralindia-01.azurewebsites.net/api";

export const CreatePathCourseSchema = z.object({
  pathId: z.number(),
  courseId: z.number(),
});

export const UpdatePathCourseOrderSchema = z.object({
  newPathCourseOrders: z.array(
    z.object({
      pathCourseId: z.number(),
      courseOrder: z.number(),
    })
  ),
});

export const getCoursesByDomainId = async ({
  domainId,
  token,
  pageNo = 0,
  pageSize = 100,
  sortBy = "createdAt",
  sortDir = "asc",
}: {
  domainId: number;
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<PathCourseListResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/course/domain/${domainId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { pageNo, pageSize, sortBy, sortDir },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by domain:", error);
    throw error;
  }
};

export const getCoursesByParentDomainId = async ({
  parentDomainId,
  token,
  pageNo = 0,
  pageSize = 100,
  sortBy = "createdAt",
  sortDir = "desc",
}: {
  parentDomainId: number;
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<Course[]> => {
  try {
    const url = ENDPOINT.GET_COURSES_BY_PARENT_DOMAIN.replace("{parentDomainId}", String(parentDomainId));
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNo, pageSize, sortBy, sortDir },
    });

    if (response.data && response.data.success && response.data.data) {
      if (response.data.data.content && Array.isArray(response.data.data.content)) {
        return response.data.data.content;
      }
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } else {
      console.error("API returned unsuccessful response:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching courses by parent domain ID:", error);
    throw error;
  }
};

export const getAllCourses = async ({
  token,
  pageNo = 0,
  pageSize = 100,
  sortBy = "createdAt",
  sortDir = "asc",
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<Course[]> => {
  try {
    const response = await axios.get(ENDPOINT.GET_ALL_COURSES, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNo, pageSize, sortBy, sortDir },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    console.error("Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

export const getPathCourseListByLearningPathId = async ({
  pathId,
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
}: {
  pathId: number;
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<any[]> => {
  const params = new URLSearchParams();
  if (pageNo !== undefined) params.append("pageNo", pageNo.toString());
  if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);

  try {
    const response = await axiosClient.get(
      `${ENDPOINT.GET_PATH_COURSES_BY_LEARNING_PATH_ID.replace("{pathId}", String(pathId))}?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      const data = response.data.data;
      return Array.isArray(data) ? data : data?.content && Array.isArray(data.content) ? data.content : [];
    } 
    else if (response.data.success === false && response.data.message === "List PathCourse is empty!") {
      return [];
    } 
    else {
      console.error("API returned unsuccessful response:", response.data);
      throw new Error(response.data.message || "Failed to fetch path courses");
    }
  } catch (error) {
    console.error("Error in getPathCourseListByLearningPathId:", error);
    throw error;
  }
};

export const addPathCourse = async ({
  pathId,
  courseId,
  token,
}: {
  pathId: number;
  courseId: number;
  token: string;
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/path-course/create`,
      { pathId, courseId },
      { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding Path Course:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response:", error.response.data);
    }
    throw error;
  }
};

export const updatePathCourseOrder = async (
  pathId: number,
  body: { newPathCourseOrders: { pathCourseId: number; courseOrder: number }[] },
  token: string
) => {
  try {
    UpdatePathCourseOrderSchema.parse(body);

    const endpoint = ENDPOINT.UPDATE_PATH_COURSE_ORDER.replace("{pathId}", String(pathId));
    const response = await axiosClient.patch(endpoint, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating path course order:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
    throw error;
  }
};

export const deletePathCourse = async (pathCourseId: number, token: string) => {
  try {
    const endpoint = ENDPOINT.DELETE_PATH_COURSE.replace("{id}", String(pathCourseId));
    const response = await axiosClient.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error deleting path course:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
    throw error;
  }
};