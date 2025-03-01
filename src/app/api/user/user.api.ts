import axiosClient from "@/lib/axiosClient";
import { addContentManagerSchema } from "@/schema/user";
import { User } from "@/types/user";
import * as z from "zod";

const ENDPOINT = {
    GETALLUSER:"/user/all",
    GETUSER:"",
    ADDCONTENTMANAGER:"/user/content-manager",
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

