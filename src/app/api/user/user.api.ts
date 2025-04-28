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
  SEARCHSTUDENT: "/user/searchStudentName",
  SEARCH_CONTETMANAGER: "/user/searchContentManagerName",
};

export const getStudent = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword,

}: {
  token: string
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

  const response = await axiosClient.get(`${ENDPOINT.GET_STUDENT}?${params.toString()}`,
    {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
  );
  return response.data.data as UserList;
};

export const getContentManager = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword,
}: {
  token : string
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

  const response = await axiosClient.get(`${ENDPOINT.GET_CONTENTMANAGER}?${params.toString()}`,
    {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
  );
  return response.data.data as UserList;
};

export const addContentManager = async (
  token : string,
  values: z.infer<typeof addContentManagerSchema>
) => {
  const response = await axiosClient.post(`${ENDPOINT.ADDCONTENTMANAGER}`, {
    userName: values.userName,
    email: values.email,
    password: values.password,
  },
  {
              headers: {
              Authorization: `Bearer ${token}`
              }
          });
  return response.data;
};
export const getUserById = async (token : string, userId :string) :Promise<User> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_USER_BY_ID}/${userId}`,
    {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
  );

  return response.data.data as User;
};
export const searchStudent = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword,

}: {
  token : string,
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

  const response = await axiosClient.get(`${ENDPOINT.SEARCHSTUDENT}?${params.toString()}`,
          {
              headers: {
              Authorization: `Bearer ${token}`
              }
          });
  return response.data.data as UserList;
};
export const searchContentManager = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  keyword,

}: {
  token : string,
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

  const response = await axiosClient.get(`${ENDPOINT.SEARCH_CONTETMANAGER}?${params.toString()}`,
      {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
  );
  return response.data.data as UserList;
};