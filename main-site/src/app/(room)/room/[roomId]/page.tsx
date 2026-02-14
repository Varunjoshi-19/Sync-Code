"use client";

import { UseGlobalContext } from "@/app/Context/GlobalContext";
import { useRoomStore } from "@/app/Store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useCallback, useState, useRef } from "react";

import { OnMount, Editor } from "@monaco-editor/react";
import { ApiEndPoints } from "@/app/Config/endPoints";
import { roomHelper } from "@/app/Utils/room";
import Topbar from "@/app/Components/Topbar";
import Sidebar from "@/app/Components/Sidebar";
import SettingsPanel from "@/app/Components/SettingPanel";

import { PanelInfo, SupportedLangType } from "@/app/Interfaces";
import { helper } from "@/app/Utils";
import { languageList } from "@/app/constants";
import { useGlobalStore } from "@/app/Store";


export default function RoomPage() {

    const params = useParams();
    const roomId = typeof params?.roomId === "string" ? params.roomId : null;
    const [sidePanel, setSidePanel] = useState<PanelInfo | null>(null);
    const [supportedLanuage, setSupportedLang] = useState<SupportedLangType[] | null>(null);
    const { currentRoom, user } = useRoomStore();
    const { handleGenerateRoom } = roomHelper;
    const router = useRouter();
    const hasJoinedRoomRef = useRef(false);


    const {
        editorRef,
        socket,
        handleEditorOnChange,
        handleUpdateEditor,
    } = UseGlobalContext();

    const { editorText, setLoader } = useGlobalStore();


    const languageType = currentRoom?.configSettings?.languageType;
    const themeId = currentRoom?.configSettings?.themeType?.id;
    const langId = languageType?.id;


    const createNewOneOrJoinThemInExisting = () => {
        if (hasJoinedRoomRef.current) return;
        hasJoinedRoomRef.current = true;

        if (!socket || !roomId) {
            router.push("/");
            return;
        }

        const details = user ?? helper.handleGetUserFromLocal();
        if (!details) {
            router.push("/");
            return;
        }
        const createdRoom = handleGenerateRoom(details, roomId);
        socket.emit("direct-room", { userId: details?.id, createdRoom });

    };

    const fetchExistingText = useCallback(async () => {
        try {
            const id = roomId || currentRoom?.roomId;
            if (!id) return;

            const url = `${ApiEndPoints.getTextCode}/${id}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch code");
            }

            const result = await response.json();
            handleUpdateEditor(result.textCode || "");
        } catch (error) {
            console.log("Failed to fetch", error);
        }
    }, [roomId, currentRoom, handleUpdateEditor]);

    const validateRoomExistance = () => {
        if (!roomId) {
            router.push("/");
            return;
        }

        if (!currentRoom || currentRoom.roomId !== roomId) {
            createNewOneOrJoinThemInExisting();
            return;
        }


    }

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
        editor.onDidChangeCursorSelection((e) => {
            socket.emit("cursor-move", {
                socketId: socket.id,
                selection: e.selection,
                roomId: roomId
            });
        });
        getCurrentLanguage();
        fetchExistingText();
    };

    const getCurrentLanguage = async () => {
        const extractedData = languageList.map((each) => {
            return { id: each.id, langName: each.aliases?.[0] ?? "", ext: each.extensions?.[0] ?? "" }
        });
        setSupportedLang(extractedData);
    };

    const handleDownloadFile = () => {
        if (!editorText.trim()) return;

        const extension = languageType?.ext.trim();
        const fileName = `${Date.now()}${extension}`;

        const blob = new Blob([editorText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);


        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();


        //  Rvoke assigned memory
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    }

    const handleOpenSettings = () => {
        setSidePanel(prev => {
            const info = { type: "SETTINGS", isOpen: true };
            if (prev == null) return info;
            if (prev.type == "SETTINGS") return null;
            return info;

        })
    }

    const handleOpenInfo = () => {
        setSidePanel(prev => {
            const info = { type: 'INFO', isOpen: true };
            if (prev == null) return info;
            if (prev.type == "INFO") return null;
            return info;

        })

    }


    useEffect(() => {
        validateRoomExistance();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoader(false);
            document.body.style.overflowY = "auto";
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [setLoader]);





    if (!currentRoom || !languageType || !themeId || !langId) {
        return null;
    }


    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden">
            <Topbar options={true} />

            <div className="flex flex-1 min-h-0">
                <div className="flex-1 min-h-0 overflow-hidden">
                    <Editor
                        onMount={handleEditorDidMount}
                        theme={themeId}
                        height="100%"
                        width="100%"
                        language={langId}
                        value={editorText}
                        onChange={(value) => handleEditorOnChange(value ?? "")}
                        options={{
                            placeholder:
                                "Write or paste code here then share. Anyone you share with will see code as it is typed!",
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                <div className="min-h-0 h-full">
                    <Sidebar
                        onSettings={handleOpenSettings}
                        onInfo={handleOpenInfo}
                        onDownload={handleDownloadFile}
                    />
                </div>
                {sidePanel &&
                    <SettingsPanel
                        supportedLanguage={supportedLanuage!}
                        sidePanelInfo={sidePanel}
                        onClose={() => setSidePanel(null)}
                    />
                }
            </div>
        </div>
    );



}
