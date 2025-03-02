import axiosClient from "@/lib/axiosClient";
import { addContentManagerSchema } from "@/schema/user";
import { User } from "@/types/user";
import * as z from "zod";

const ENDPOINT = {
    GETALLUSER:"/user/all",
    GETUSER:"",
    ADDCONTENTMANAGER:"/user/content-manager",
    GET_STUDENT:"/user/get-student",
    GET_CONTENTMANAGER:"/user/get-content-manager",
    GET_USER_BY_ID:"/user/getUser",
};

export const getAllUser = async () :Promise<User[]> => {
  const response = await axiosClient.get(ENDPOINT.GETALLUSER);

  return response.data.data as User[];
};

export const addContentManager = async (adminId : number, values: z.infer<typeof addContentManagerSchema>) => {
  const response = await axiosClient.post(`${ENDPOINT.ADDCONTENTMANAGER}/${adminId}`,
    {
      userName: values.userName,
      email : values.email,
      password : values.password
    }
  );

  return response.data;
};
export const getStudent = async () :Promise<User[]> => {
  const response = await axiosClient.get(ENDPOINT.GET_STUDENT);

  return response.data.data as User[];
};

export const getContentManager = async () :Promise<User[]> => {
  const response = await axiosClient.get(ENDPOINT.GET_CONTENTMANAGER);

  return response.data.data as User[];
};

export const getUserById = async (userId :string) :Promise<User> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_USER_BY_ID}/${userId}`);

  return response.data.data as User;
};
