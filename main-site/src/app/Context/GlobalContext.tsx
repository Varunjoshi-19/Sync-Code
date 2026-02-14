"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Modules/Loader";
import { useRoomStore } from "../Store/store";
import {
    GlobalContextPayload,
    RoomDetailsType,
    SettingsType,
} from "../Interfaces";
import ShareDialog from "../Modules/ShareDilog";
import Pricing from "../(plans)/components/Pricing";
import { useGlobalStore } from "../Store";
import socket from "../hooks/socket";
import { CursorColors } from "../constants";

const GlobalContext = React.createContext<GlobalContextPayload | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {


    const { setCurrentRoom, setRoomError,
        currentRoom, updateRoomSettings, setUser,
    } = useRoomStore();

    const { loader, shareDilog, showPricingPopup,
        setLoader, setEditorText, setShowPricingPopup } = useGlobalStore();

    const router = useRouter();
    const pathName = usePathname();
    const params = useParams();
    const currentRoomId = params.roomId;


    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);

    const [userColors, setUserColors] = useState<{ [socketId: string]: string }>({});
    const [remoteCursors, setRemoteCursors] = useState<{ [socketId: string]: any }>({});


    const handleOnRoomCreation = (roomDetails: RoomDetailsType) => {
        setCurrentRoom(roomDetails);
        toast.success(`Room created ${roomDetails.roomId}`);
        const url = `/room/${roomDetails.roomId}`;
        if (pathName == url) return;

        router.push(url);

    }

    const handleRoomExists = (room: RoomDetailsType | null) => {
        if (!room) {
            setRoomError("Room with this id doesn't exists !!");
            return;
        }

        setCurrentRoom(room);
        toast.success(`Room joined sucessfully ${room.roomId}`)
        const url = `/room/${room.roomId}`;
        if (pathName == url) return;

        // this for leaving the previous room by that user.
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

    const handleSetUpdatedSettings = ({ type, updatedSettings }: { type: string; updatedSettings: any }) => {

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

    }

    const handleSettingsFailed = ({ limit, message }: { limit: number, message: string }) => {
        toast.error(message);
        if (limit) {
            updateRoomSettings({ membersLimit: limit });
        }
    };

    const handleRoomFull = () => {
        toast.error("Room full !!");
        router.push("/");
        return;
    }

    const assignColor = (socketId: string) => {
        if (userColors[socketId]) return userColors[socketId];

        const usedColors = Object.values(userColors);
        const availableColors = CursorColors.filter((color) => !usedColors.includes(color));
        const color = availableColors[0] || CursorColors[0];

        setUserColors(prev => ({ ...prev, [socketId]: color }));
        return color;
    };

    const handleRemoteCursorMove = (data: { socketId: string; selection: any }) => {
        const monaco = (window as any).monaco;
        if (!monaco || !editorRef.current || socket.id === data.socketId) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        const sel = data.selection;
        if (!sel) {
            const oldIds = remoteCursors[data.socketId] || [];
            if (oldIds.length) {
                editorRef.current.deltaDecorations(oldIds, []);
                setRemoteCursors(prev => {
                    const { [data.socketId]: _, ...rest } = prev;
                    return rest;
                });
            }
            return;
        }

        const color = assignColor(data.socketId);

        const isCaret =
            sel.startLineNumber === sel.endLineNumber &&
            sel.startColumn === sel.endColumn;

        const newDecorations: any[] = isCaret
            ? [
                {
                    range: new monaco.Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber, sel.startColumn),
                    options: {
                        className: "remote-cursor",
                        beforeContentClassName: `remote-cursor-${data.socketId}`,
                    },
                },
            ]
            : [
                {
                    range: new monaco.Range(sel.startLineNumber, sel.startColumn, sel.endLineNumber, sel.endColumn),
                    options: {
                        className: "remote-selection",
                        inlineClassName: `remote-selection-${data.socketId}`,
                        stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
                    },
                },
            ];

        const oldIds = remoteCursors[data.socketId] || [];
        const newIds = editorRef.current.deltaDecorations(oldIds, newDecorations);
        setRemoteCursors(prev => ({ ...prev, [data.socketId]: newIds }));

        // inject CSS if not already
        if (!document.getElementById(`cursor-style-${data.socketId}`)) {
            const style = document.createElement('style');
            style.id = `cursor-style-${data.socketId}`;
            style.innerHTML = `
                .remote-selection-${data.socketId} {
                    background-color: ${color}33; /* translucent */
                }
                .remote-cursor-${data.socketId}::after {
                    content: "";
                    position: absolute;
                    width: 2px;
                    height: 1.2em;
                    background: ${color};
                    animation: blink 1s steps(1) infinite;
                }
                `;
            document.head.appendChild(style);
        }
    };

    const handleUserLeft = ({ socketId }: { socketId: string }) => {

        if (!editorRef.current) return;

        const oldIds = remoteCursors[socketId] || [];
        if (oldIds.length) {
            editorRef.current.deltaDecorations(oldIds, []);
        }

        setRemoteCursors(prev => {
            const { [socketId]: _, ...rest } = prev;
            return rest;
        });

        setUserColors(prev => {
            const { [socketId]: _, ...rest } = prev;
            return rest;
        });

        const styleEl = document.getElementById(`cursor-style-${socketId}`);
        if (styleEl) {
            styleEl.remove();
        }
    };


    useEffect(() => {

        socket.on("updated-settings", handleSetUpdatedSettings);
        socket.on("settings-failed", handleSettingsFailed);
        socket.on("cursor-move", handleRemoteCursorMove);
        socket.on("document-update", handleUpdateEditor);
        socket.on("room-created", handleOnRoomCreation);
        socket.on("room-exists", handleRoomExists);
        socket.on("room-full", handleRoomFull);
        socket.on("user-left", handleUserLeft);

        return () => {
            socket.off("updated-settings", handleSetUpdatedSettings);
            socket.off("settings-failed", handleSettingsFailed);
            socket.off("document-update", handleUpdateEditor);
            socket.off("cursor-move", handleRemoteCursorMove);
            socket.off("room-created", handleOnRoomCreation);
            socket.off("room-exists", handleRoomExists);
            socket.off("room-full", handleRoomFull);
            socket.off("user-left", handleUserLeft);


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

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        if (!currentRoomId) return;

        return () => {
            setEditorText("");
            socket.emit("leave-room", { socketId: socket.id });
        }
    }, [currentRoomId]);





    return (
        <GlobalContext.Provider value={{
            socket,
            editorRef,
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


