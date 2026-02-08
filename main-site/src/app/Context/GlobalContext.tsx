"use client";

import { BACKEND_URL } from "@/app/Config/endPoints";
import { useRouter, usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Loader from "../Modules/Loader";
import { useRoomStore } from "../Store/store";
import { GlobalContextPayload, RoomDetailsType, SettingsType, SettingType, ShareDilogBoxType } from "../Interfaces";
import ShareDialog from "../Modules/ShareDilog";
import { roomHelper } from "../Utils/room";
import { helper } from "../Utils";


const GlobalContext = React.createContext<GlobalContextPayload | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {

    const socket = useMemo(() => io(BACKEND_URL, {
        withCredentials: true
    }), []);


    const [loader, setLoader] = useState<boolean>(false);
    const { setCurrentRoom, setRoomError, currentRoom, updateRoomSettings, setUser } = useRoomStore();
    const [shareDilog, setShareDilog] = useState<ShareDilogBoxType | null>(null);
    const [editorText, setEditorText] = useState<string>("");
    const router = useRouter();
    const pathName = usePathname();

    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);

    const { handleGenerateCred, assignRandomName } = roomHelper;
    const { handleGetUserFromLocal } = helper;



    const handleOnRoomCreation = useCallback((roomDetails: RoomDetailsType) => {
        setCurrentRoom(roomDetails);
        toast.success(`Room created ${roomDetails.roomId}`);
        const url = `/room/${roomDetails.roomId}`;
        if (pathName == url) return;

        router.push(url);

    }, [router, setCurrentRoom, toast]);

    const handleRoomExists = useCallback((room: RoomDetailsType | null) => {
        if (!room) {
            setRoomError("Room with this id doesn't exists !!");
            return;
        }

        setCurrentRoom(room);
        toast.success(`Room joined sucessfully ${room.roomId}`)
        const url = `/room/${room.roomId}`;
        if (pathName == url) return;
        router.push(url);
    }, [router, setCurrentRoom, toast]);

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


    useEffect(() => {

        socket.on("room-created", handleOnRoomCreation);
        socket.on("document-update", handleUpdateEditor);
        socket.on("room-exists", handleRoomExists);
        socket.on("updated-settings", handleSetUpdatedSettings);

        return () => {
            socket.off("updated-settings", handleSetUpdatedSettings);
            socket.off("room-created", handleOnRoomCreation);
            socket.off("document-update", handleUpdateEditor);
            socket.off("room-exists", handleRoomExists);
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
        console.log('details' , details);
        setUser(details);
    }, []);




    return (
        <GlobalContext.Provider value={{
            socket,
            editorText,
            editorRef,
            shareDilog,
            setShareDilog,
            setLoader,
            setEditorText,
            handleEditorOnChange,
            handleUpdateEditor,
        }}>
            {loader && (<Loader />)}
            {shareDilog && (<ShareDialog />)}
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


