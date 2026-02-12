"use client"
import { createContext, useContext, useEffect } from "react"
import { useGlobalStore } from "../Store"
import { useRoomStore } from "../Store/store"

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const { setUser } = useRoomStore();
    const { setLoader } = useGlobalStore();

    useEffect(() => {

        const validateUser = async () => {
            setLoader(true);
            try {
                const res = await fetch("/api/auth/me", {
                    credentials: "include",
                })

                if (!res.ok) throw new Error()

                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoader(false);
            }
        }

        validateUser();
    }, [])

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
