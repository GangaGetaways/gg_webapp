import axios from "axios";
import { getCookieInCSR } from "@/utils/cookies/cookiesInCSR";

const gg_at = getCookieInCSR('gg_at');

//API Instances
export const authAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_PATH,
  headers: {
    "Content-Type": "application/json"
  }
});

export const userInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UM_BASE_PATH,
  headers: {
    "Content-Type": "application/json",
    Authorization: gg_at
  },
});

userInstance.interceptors.request.use(req => {
    if(!gg_at){
        const access_token = getCookieInCSR('gg_at');
        if(access_token){
            req.headers.Authorization = `Bearer ${access_token}`;
            return req;
        }else{
            //Redirect to login page
        }
    }
})

//abort browser api instance
export const APIcontroller = new AbortController();
