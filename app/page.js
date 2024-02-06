"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
//API
import { postRegisterUser } from "@/lib/apiCalls/auth.api";
export default function Home() {
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const registerUserAction = async () => {
        let reqBody = {
            email: "abc1@gmail.com",
            userName: "Babu Bhaiya",
            passWord: "mainahibataunga",
            role: "ADMIN",
        };
        const response = await postRegisterUser(reqBody);
        if (response) {
            console.log("res", response);
        }
        setIsButtonClicked(true);
    };
    useEffect(()=>{
      console.log(process.env.AUTH_BASE_PATH)
    })
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
