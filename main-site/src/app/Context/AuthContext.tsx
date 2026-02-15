"use client"
import { createContext, useContext, useEffect } from "react"
import { useGlobalStore } from "../Store"
import { useRoomStore } from "../Store/store"
import { ApiEndPoints } from "../Config/endPoints";
import useRoom from "../hooks";
import socket from "../hooks/socket";

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const { setUser, setLoggedIn, } = useRoomStore();
    const { setLoader } = useGlobalStore();
    const { handleSetRandomUser } = useRoom({ socket, setLoader });


    useEffect(() => {

        const validateUser = async () => {
            setLoader(true);
            try {
                const res = await fetch("/api/auth/me", {
                    method: "POST",
                    credentials: "include", 
                });

                const data = await res.json();

                if (!res.ok) {
                    setLoggedIn(false);
                    handleSetRandomUser();
                } else {
                    setUser(data.user);
                    setLoggedIn(true);
                }
            } catch {
                setLoggedIn(false);
                handleSetRandomUser();
            } finally {
                setLoader(false);
            }
        };


        validateUser();
    }, []);


    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
