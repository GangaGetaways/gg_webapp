import {authAxiosInstance} from "@/lib/apiHandler";
import {TOKEN_ENDPOINT} from "@/lib/apiCalls/endPoints";
export const postGetRegistrationToken = (payload, headers) =>
    authAxiosInstance
        .post(TOKEN_ENDPOINT, payload, {
            headers: headers
        })
        .then((response) => response)
        .catch((error) => error.response);