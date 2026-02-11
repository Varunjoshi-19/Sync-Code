"use client";

import { BACKEND_URL } from "@/app/Config/endPoints";
import { useRouter, usePathname, useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Loader from "../Modules/Loader";
import { useRoomStore } from "../Store/store";
import {
    GlobalContextPayload,
    RoomDetailsType,
    SettingsType,
    ShareDilogBoxType
} from "../Interfaces";
import ShareDialog from "../Modules/ShareDilog";
import { roomHelper } from "../Utils/room";
import { helper } from "../Utils";
import PlansPage from "../(plans)/pricing/page";
import Pricing from "../(plans)/components/Pricing";


const GlobalContext = React.createContext<GlobalContextPayload | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {




    const [loader, setLoader] = useState<boolean>(false);
    const { setCurrentRoom, setRoomError,
        currentRoom, updateRoomSettings, setUser,
    } = useRoomStore();
    const [shareDilog, setShareDilog] = useState<ShareDilogBoxType | null>(null);
    const [editorText, setEditorText] = useState<string>("");
    const [showPricingPopup, setShowPricingPopup] = useState<boolean>(false);
    const router = useRouter();
    const pathName = usePathname();
    const params = useParams();
    const currentRoomId = params.roomId;


    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);

    const { handleGenerateCred, assignRandomName } = roomHelper;
    const { handleGetUserFromLocal } = helper;


    const socket = useMemo(() => io(BACKEND_URL, {
        transports: ["websocket"],
        withCredentials: true,
        autoConnect: false
    }), []);


    const handleOnRoomCreation = useCallback((roomDetails: RoomDetailsType) => {
        setCurrentRoom(roomDetails);
        toast.success(`Room created ${roomDetails.roomId}`);
        const url = `/room/${roomDetails.roomId}`;
        if (pathName == url) return;

        router.push(url);

    }, [router, setCurrentRoom, toast]);

    const handleRoomExists = (room: RoomDetailsType | null) => {
        if (!room) {
            setRoomError("Room with this id doesn't exists !!");
            return;
        }

        setCurrentRoom(room);
        toast.success(`Room joined sucessfully ${room.roomId}`)
        const url = `/room/${room.roomId}`;
        if (pathName == url) return;

        socket.emit("leave-room", { socketId: socket.id });
        router.push(url);
    };

    const handleEditorOnChange = (value: string) => {
        if (isRemoteUpdate.current) return;

        setEditorText(value);
        socket.emit("document-change",
            { currentRoom, textValue: value });
    }

    const handleUpdateEditor = (incomingText: string) => {
        if (!editorRef.current) return;

        const editor = editorRef.current;
        const currentValue = editor.getValue();

        if (currentValue === incomingText) return;

        isRemoteUpdate.current = true;

        editor.executeEdits("", [
            {
                range: editor.getModel().getFullModelRange(),
                text: incomingText,
            },
        ]);


        setEditorText(incomingText);
        isRemoteUpdate.current = false;

    }

    const handleSetUpdatedSettings = useCallback(({ type, updatedSettings }: { type: string; updatedSettings: any }) => {

        switch (type) {
            case SettingsType.LANG:
                updateRoomSettings({ languageType: updatedSettings.languageType });
                break;

            case SettingsType.EDITOR:
                updateRoomSettings({ themeType: updatedSettings.themeType });
                break;

            case SettingsType.MEMBER:
                updateRoomSettings({ membersLimit: updatedSettings.membersLimit });
                break;
        }

    }, [updateRoomSettings]);

    const handleSettingsFailed = ({ limit, message }: { limit: number, message: string }) => {
        toast.error(message);
        if (limit) {
            updateRoomSettings({ membersLimit: limit });
        }
    };

    const handleRoomFull = useCallback(() => {
        toast.error("Room full !!");
        router.push("/");
        return;
    }, [router]);


    useEffect(() => {

        socket.on("room-created", handleOnRoomCreation);
        socket.on("document-update", handleUpdateEditor);
        socket.on("room-exists", handleRoomExists);
        socket.on("room-full", handleRoomFull);
        socket.on("updated-settings", handleSetUpdatedSettings);
        socket.on("settings-failed", handleSettingsFailed);

        return () => {
            socket.off("updated-settings", handleSetUpdatedSettings);
            socket.off("room-created", handleOnRoomCreation);
            socket.off("document-update", handleUpdateEditor);
            socket.off("room-exists", handleRoomExists);
            socket.off("room-full", handleRoomFull);
            socket.off("settings-failed", handleSettingsFailed);

        }

    }, [socket, handleSetUpdatedSettings]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoader(false);
        }, 2500);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [loader]);


    useEffect(() => {
        let details = handleGetUserFromLocal() || handleGenerateCred(assignRandomName());
        setUser(details);

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        if (!currentRoomId) return;

        return () => {
            // empty out the editor value 
            setEditorText("");
            socket.emit("leave-room", { socketId: socket.id });
        }
    }, [currentRoomId]);





    return (
        <GlobalContext.Provider value={{
            socket,
            editorText,
            editorRef,
            shareDilog,
            showPricingPopup,
            setShowPricingPopup,
            setShareDilog,
            setLoader,
            setEditorText,
            handleEditorOnChange,
            handleUpdateEditor,
        }}>
            {loader && (<Loader />)}
            {shareDilog && (<ShareDialog />)}
            {showPricingPopup && (<Pricing popUp={true} setClose={setShowPricingPopup} />)}
            {children}
        </GlobalContext.Provider>
    )
}


export const UseGlobalContext = () => {

    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error("Context is not available!!");
    }
    return context;
}


