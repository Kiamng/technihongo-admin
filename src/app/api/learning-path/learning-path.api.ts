/* learning-path.api.ts */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/lib/axiosClient";
import { CreateLearningPathSchema } from "@/schema/learning-path";
import { LearningPath } from "@/types/learningPath";
import { z } from "zod";
import axios, { AxiosError } from "axios";

const ENDPOINT = {
  ALL: '/learning-path/all',
  ADD: '/learning-path/create',
  UPDATELEARNINGPATH: '/learning-path/update/{pathId}',
  DELETELEARNINGPATH: 'learning-path/delete/{id}',
  GETBYID: '/learning-path/{id}',
  GET_PARENT_DOMAINS: 'https://technihongo-hueze5fkd5g2f7bk.centralindia-01.azurewebsites.net/api/domain/all',
};
const BASE_URL = "https://technihongo-hueze5fkd5g2f7bk.centralindia-01.azurewebsites.net/api";
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

export const addLearningPath = async (values: z.infer<typeof CreateLearningPathSchema>, token: string) => {
  try {
    CreateLearningPathSchema.parse(values);
    
    const response = await axiosClient.post(ENDPOINT.ADD, {
      title: values.title,
      description: values.description,
      domainId: Number(values.domainId),
      isPublic: values.isPublic,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error adding Learning Path:", error);
    throw error;
  }
};

export const updateLearningPath = async (
  pathId: number,
  values: {
    title: string;
    description: string;
    domainId: number;
    isPublic: boolean;
  },
  token: string
) => {
  try {
    const requestData = {
      title: values.title,
      description: values.description,
      domainId: values.domainId,
      isPublic: values.isPublic !== undefined ? values.isPublic : false
    };
    
    const response = await axiosClient.patch(
      ENDPOINT.UPDATELEARNINGPATH.replace("{pathId}", String(pathId)),
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.success === false) {
      throw new Error(response.data.message || "Failed to update learning path");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating learning path:", error);
    throw error;
  }
};

export const deleteLearningPath = async (pathId: number, token: string) => {
  try {
    const response = await axiosClient.delete(
      ENDPOINT.DELETELEARNINGPATH.replace("{id}", String(pathId)),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error deleting Learning Path:", error);
    throw error;
  }
};

export interface Domain {
  domainId: number;
  tag: string;
  name: string;
  description: string;
  parentDomainId: number | null;
}

export const getParentDomains = async (token: string): Promise<Domain[]> => {
  try {
    const response = await axios.get(ENDPOINT.GET_PARENT_DOMAINS, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        pageNo: 0,
        pageSize: 100,
        sortDir: "desc"
      }
    });

    if (response.data.success && response.data.data?.content) {
      return response.data.data.content.filter((domain: Domain) => domain.parentDomainId === null);
    } else {
      throw new Error(response.data.message || "Failed to fetch parent domains");
    }
  } catch (error) {
    console.error("Error fetching parent domains:", error);
    throw error;
  }
};