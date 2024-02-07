import { authAxiosInstance } from "../apiHandler";
import { CREATE_USER } from "./endPoints";

export const postRegisterUser = (payload, headers) =>
    authAxiosInstance
        .post(CREATE_USER, payload, {
            headers: headers
        })
        .then((response) => response)
        .catch((error) => error.response);


