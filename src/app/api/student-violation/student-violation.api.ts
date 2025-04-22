import axiosClient from "@/lib/axiosClient";
import { ViolationList } from "@/types/student-violation";

const ENDPOINT = {
  GET_ALL_VIOLATIONS: "/violation/all",
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