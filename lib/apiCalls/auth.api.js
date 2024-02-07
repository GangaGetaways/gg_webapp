import { authAxiosInstance, userInstance } from "../apiHandler";
import { CREATE_USER, AUTH_TOKEN, USER_LOGIN } from "./endPoints";
import { getCookieInCSR, setCookieInCSR } from "@/utils/cookies/cookiesInCSR";

const callAuthRegistrar = async () => {
  const config = [
    {
      grant_type: "client_credentials",
      authentication_method: "client_secret_basic",
      scope: "client.create",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${process.env.REGISTRAR_AUTH_KEY}`,
      },
    },
  ];
  return authAxiosInstance
    .post(AUTH_TOKEN, ...config)
    .then(({ data }) => {
      setCookieInCSR("gg_at", data?.access_token, data?.expires_in);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postRegisterUser = async (payload, callback) => {
  await callAuthRegistrar();
  authAxiosInstance
    .post(CREATE_USER, payload, {
        headers: {
            Authorization: `Bearer ${getCookieInCSR('gg_at')}`
        }
    })
    .then((response) => {
        console.log(response);
        typeof callback === "function" && callback(response.data);
    })
    .catch((error) => {
        console.log(error.response);
    });
}

export const loginUser = async (payload, callback) => {
  try {
    let response = await userInstance.post(USER_LOGIN, payload);
    let data = await response.json();

    if (response.status === 200) {
        typeof callback === "function" && callback(data);
    } else {
      console.log("Something went wrong!");
    }
  } catch (err) {
    console.log(err);
  }
};
