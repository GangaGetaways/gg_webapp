'use client';

import { postRegisterUser } from "@/lib/apiCalls/auth.api";
import { useRouter } from 'next/navigation';

const Registration = () => {
    const router = useRouter();

    const handleRegisteration = async (e) => {
        postRegisterUser({
            email: 'abc@gmail.com',
            password: '123456',
            phoneNumber: '9191919191'
        }, ()=>{
            router.replace('/homepage');
        })
    }

    return(
        <button onClick={handleRegisteration}>Register</button>
    )
}

export default Registration;