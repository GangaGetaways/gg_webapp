"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
//API
import { postRegisterUser } from "@/lib/apiCalls/auth.api";
import { postGetRegistrationToken } from "@/lib/apiCalls/token.api";

export default function Home() {
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [bearerToken, setBearerToken] = useState();
    const fetchToken = async () => {
        // Define the request body
        const requestBody = new URLSearchParams({
            'grant_type': 'client_credentials',
            'authentication_method': 'client_secret_basic',
            'scope': 'client.create'
        });

        // Define the request headers
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic Z2FuZ2EtZ2V0YXdheXMtcmVnaXN0cmFyLWNsaWVudDpKQ1pEWG1GdFdWVk9lRFZtYW5OWmRrSnBablpHU0VGeVFGNXdhVFltV0dKdmVUUjBaSFo2S2xsR09RPT0='
        };

        try {
            const response = await postGetRegistrationToken(requestBody.toString(), headers);
            console.log('Token response:', response.data);
            setBearerToken(response.data?.token_type + " " + response.data?.access_token);
        } catch (error) {
            console.error('Error fetching token:', error, response.statusText);
        }

    };
    useEffect(()=>{
      console.log(process.env.AUTH_BASE_PATH)
    }, [])
    const registerUserAction = async () => {
        fetchToken(); //Trigger on reload.
        console.log("Bearer Token Generated :: ", bearerToken);
        // Call the function to fetch the token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': bearerToken
        };
        let reqBody = {
            "email": "ds.pratap199+123@gmail.com",
            "grantTypes": "refresh_token",
            "redirectUris": "http://localhost:7088/v1/api/users",
            "phoneNumber": "9169761452",
            "password": "zaq12wsx"
        };
        const response = await postRegisterUser(JSON.stringify(reqBody), headers);
        console.log("User Created and Registered!", response);
        setIsButtonClicked(true);
    };
    return (
        <main className={styles.main}>
            <button
                onClick={registerUserAction}
                style={{
                    width: "4rem",
                    height: "2.5rem",
                    background: "#e6e6e6e",
                }}
            >
                {isButtonClicked ? "Clicked" : "Click"}
            </button>
        </main>
    );
}
