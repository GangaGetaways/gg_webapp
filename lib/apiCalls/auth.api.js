import { authAxiosInstance } from "../apiHandler";
import { CREATE_USER } from "./endPoints";

export const postRegisterUser = (payload) =>
    authAxiosInstance
        .post(CREATE_USER, payload)
        .then((response) => response)
        .catch((error) => error.response);

