import axiosClient from "@/lib/axiosClient";
import { addContentManagerSchema } from "@/schema/user";
import { User, UserList } from "@/types/user";
import * as z from "zod";

const ENDPOINT = {
  GETALLUSER: "/user/all",
  GETUSER: "",
  ADDCONTENTMANAGER: "/user/content-manager",
  GET_STUDENT: "/user/student/paginated",
  GET_CONTENTMANAGER: "/user/content-managers/paginated",
  GET_USER_BY_ID: "/user/getUser",
};

export const getStudent = async ({
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword,

}: {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string;
}): Promise<UserList> => {
  const params = new URLSearchParams();
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  if (keyword) params.append("keyword", keyword);

  const response = await axiosClient.get(`${ENDPOINT.GET_STUDENT}?${params.toString()}`);
  return response.data.data as UserList;
};

export const getContentManager = async ({
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword,
}: {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string;
}): Promise<UserList> => {
  const params = new URLSearchParams();
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  if (keyword) params.append("keyword", keyword);

  const response = await axiosClient.get(`${ENDPOINT.GET_CONTENTMANAGER}?${params.toString()}`);
  return response.data.data as UserList;
};

export const addContentManager = async (
  adminId: number,
  values: z.infer<typeof addContentManagerSchema>
) => {
  const response = await axiosClient.post(`${ENDPOINT.ADDCONTENTMANAGER}/${adminId}`, {
    userName: values.userName,
    email: values.email,
    password: values.password,
  });
  return response.data;
};
export const getUserById = async (userId :string) :Promise<User> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_USER_BY_ID}/${userId}`);

  return response.data.data as User;
};