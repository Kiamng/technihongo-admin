import axiosClient from "@/lib/axiosClient";
import { CreateLearningPathSchema } from "@/schema/learning-path";

import { LearningPath } from "@/types/learningPath";
import { z } from "zod";
const ENDPOINT = {
  ALL: '/learning-path/all',
  ADD: '/learning-path/create',
  UPDATELEARNINGPATH: '/learning-path/update/{pathId}',
  DELETELEARNINGPATH: 'learning-path/delete/{id}',
  GETBYID: '/learning-path/{id}',
  
};

export const getAllLearningPaths = async (token: string): Promise<LearningPath[]> => {
  const response = await axiosClient.get(ENDPOINT.ALL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data as LearningPath[];
};

export const getLearningPathById = async (id: number, token: string): Promise<LearningPath> => {
  const response = await axiosClient.get(ENDPOINT.GETBYID.replace('{id}', id.toString()), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch learning path');
  }

  return response.data.data as LearningPath;
};

export const addLearningPath = async (values: z.infer<typeof CreateLearningPathSchema>,token:string) => {
    try {
      // Validate data against schema before sending to backend
      CreateLearningPathSchema.parse(values);
      
      // Send request to backend
      const response = await axiosClient.post(ENDPOINT.ADD, {
          title: values.title,
          description: values.description, // Fixed typo: removed duplicate "descrition" field
          domainId: Number(values.domainId),
          isPublic: values.isPublic,
      },
      { headers: {
        Authorization: `Bearer ${token}`
      }}
    );

      return response.data;
    } catch (error) {
        console.error("Error adding Learning Path:", error);
        throw error; // Throw the actual error for better debugging
    }
};
export const updateLearningPath = async (
  pathId: number,
  values: {
    title: string;
    description: string;
    domainId: number;
    isPublic: boolean;
  }
) => {
  try {
    const response = await axiosClient.patch(
      ENDPOINT.UPDATELEARNINGPATH.replace("{pathId}", String(pathId)),
      {
        title: values.title,
        description: values.description,
        domainId: values.domainId,
        isPublic: values.isPublic,
      }
    );

    // Kiểm tra response từ server
    if (!response.data) {
      throw new Error("No response data received");
    }

    // Kiểm tra trạng thái thành công
    if (response.data.success === false) {
      throw new Error(response.data.message || "Failed to update learning path");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating learning path:", error);
    throw error; // Throw the actual error for better debugging
  }
};

export const deleteLearningPath = async (pathId: number) => {
  try {
    const response = await axiosClient.delete(
      ENDPOINT.DELETELEARNINGPATH.replace("{id}", String(pathId))
    );
    
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting Learning Path:", {
        message: error.message,
        name: error.name
      });
    }
    throw error;
  }
};