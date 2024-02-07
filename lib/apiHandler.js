import axios from "axios";
//API Instances
export const authAxiosInstance = axios.create({
    baseURL: "http://localhost:7089",
});
export const userInstance = axios.create({
    baseURL: "http://localhost:7088",
});
//abort browser api instance
export const APIcontroller = new AbortController();
