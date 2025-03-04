import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  LOGIN: "/user/login"
};
export const login = async (email: string, password: string) => {
  const response = await axiosClient.post(ENDPOINT.LOGIN, {
    email: email,
    password: password,
  });

  return response.data;
};