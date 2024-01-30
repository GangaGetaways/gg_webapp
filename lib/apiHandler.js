import axios from "axios";
//API Instances
export const authAxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_PATH,
});
export const userInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_UM_BASE_PATH,
});
//abort browser api instance
export const APIcontroller = new AbortController();
