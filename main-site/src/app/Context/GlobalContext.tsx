"use client";

import { BACKEND_URL } from "@/app/Config/endPoints";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Loader from "../Modules/Loader";
import { useRoomStore } from "../Store/store";
import { GlobalContextPayload, RoomDetailsType } from "../Interfaces";


const GlobalContext = React.createContext<GlobalContextPayload | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {

    const socket = useMemo(() => io(BACKEND_URL, {
        withCredentials: true
    }), []);

    const { setCurrentRoom, setRoomError, currentRoom } = useRoomStore();
    const [loader, setLoader] = useState<boolean>(true);
    const [editorText, setEditorText] = useState<string>(`// write your code here....`);
    const router = useRouter();

    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);



    const handleOnRoomCreation = useCallback((roomDetails: RoomDetailsType) => {
        setCurrentRoom(roomDetails);
        router.push(`/room/${roomDetails.roomId}`);

    }, []);

    const handleRoomExists = useCallback((room: RoomDetailsType | null) => {
        if (!room) {
            setRoomError("Room with this id doesn't exists !!");
            return;
        }

        setCurrentRoom(room);
        router.push(`/room/${room.roomId}`);
    }, [router, setCurrentRoom]);

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

        isRemoteUpdate.current = false;

    }


    useEffect(() => {

        socket.on("room-created", handleOnRoomCreation);
        socket.on("document-update", handleUpdateEditor);
        socket.on("room-exists", handleRoomExists);

        return () => {
            socket.off("room-created", handleOnRoomCreation);
            socket.off("document-update", handleUpdateEditor);
            socket.off("room-exists", handleRoomExists);
        }

    }, [socket]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoader(false);
            document.body.style.overflowY = "auto";
        }, 2500);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [loader]);


    const values = {
        socket,
        editorText,
        handleEditorOnChange,
        editorRef,
        setLoader
    }

    return (
        <GlobalContext.Provider value={values}>
            {loader && (<Loader />)}
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


