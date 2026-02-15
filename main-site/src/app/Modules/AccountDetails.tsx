"use client";

import useRoom from "../hooks";
import { useGlobalStore } from "../Store";
import socket from "../hooks/socket";
import { useRoomStore } from "../Store/store";
import { useRouter } from "next/navigation";
import { ApiEndPoints } from "../Config/endPoints";


type MenuItem =
    | { title: string; link: string; callback?: never }
    | { title: string; callback: () => void; link?: never };

const AccountDetails = () => {

    const { setLoader, setEditorText, } = useGlobalStore();
    const { handleCreateRoom, handleSetRandomUser } = useRoom({ socket, setLoader });
    const { setLoggedIn, setUser } = useRoomStore();
    const router = useRouter();


    const handleLogout = async () => {
        setLoggedIn(false);
        setUser(null);
        handleSetRandomUser();
        await fetch("/api/auth/logout", { method: 'POST', credentials: "include" });
        router.push("/");
    }


    const menu: MenuItem[] = [
        { title: "Your CodeSync", link: "/codes" },
        {
            title: "New CodeSync", callback: () => {
                setEditorText("");
                handleCreateRoom();

            }
        },
        { title: "Account Settings", link: "/settings" },
        { title: "Log Out", callback: handleLogout }

    ];

    const baseStyle = "cursor-pointer block w-full text-left px-4 py-3 text-blue-700 hover:bg-gray-100 rounded-lg";

    return (
        <div className="z-10 absolute right-0 mt-4 w-56 bg-white rounded-lg shadow-lg border">
            {menu.map((item, i) => {
                if ("link" in item) {
                    return (
                        <a key={i} href={item.link} className={baseStyle}>
                            {item.title}
                        </a>
                    );
                }

                return (
                    <button key={i} onClick={item.callback} className={baseStyle}>
                        {item.title}
                    </button>
                );
            })}
        </div>
    );
};

export default AccountDetails;