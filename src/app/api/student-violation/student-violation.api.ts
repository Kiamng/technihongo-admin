import axiosClient from "@/lib/axiosClient";
import { ViolationList, ViolationSummary } from "@/types/student-violation";

const ENDPOINT = {
  GET_ALL_VIOLATIONS: "/violation/all",
  GET_VIOLATIONS_SUMMARY : '/violation/summary',
  VIOLATION_PROCESS:'/violation/handle'
};

export const getAllViolations = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  classifyBy,
  status,
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  classifyBy?: "FlashcardSet" | "Rating";
  status?: "PENDING" | "RESOLVED" | "DISMISSED" | "";
}): Promise<ViolationList> => {
  const params = new URLSearchParams();
  if (pageNo !== undefined) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  if (classifyBy) params.append("classifyBy", classifyBy);
  if (status) params.append("status", status);

  const response = await axiosClient.get(`${ENDPOINT.GET_ALL_VIOLATIONS}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data as ViolationList;
};

export const getViolationSummary = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  entityId,
  classifyBy,
  status,
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  entityId: number;
  classifyBy?: "FlashcardSet" | "Rating";
  status?: "PENDING" | "RESOLVED" | "DISMISSED" | "";
}) :Promise<ViolationSummary> => {
  const params = new URLSearchParams();
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  if (entityId) params.append("entityId", entityId.toString());
  if (classifyBy) params.append("classifyBy", classifyBy);
  if (status) params.append("status", status);

  const response = await axiosClient.get(`${ENDPOINT.GET_VIOLATIONS_SUMMARY}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data
}

export const processViolation = async (token : string, violationId : number, reason : string, status : string) => {
  const response = await axiosClient.patch(`${ENDPOINT.VIOLATION_PROCESS}/${violationId}`,{
    actionTaken : reason,
    status : status
  },{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}