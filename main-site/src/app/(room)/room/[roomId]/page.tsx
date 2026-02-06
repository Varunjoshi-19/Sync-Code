"use client";

import { UseGlobalContext } from "@/app/Context/GlobalContext";
import { useRoomStore } from "@/app/Store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Editor } from "@monaco-editor/react";
// import CodeEditor from "@/app/Modules/Code-Editor";

export default function RoomPage() {


    const { roomId } = useParams();
    const router = useRouter();
    
    const { setLoader, handleEditorOnChange,
        editorText, editorRef,
    } = UseGlobalContext();

    const { currentRoom } = useRoomStore();


    const validateRoomExistance = () => {
        console.log("both", currentRoom, roomId);
        if (!currentRoom || !roomId) {
            router.push("/");
            return;
        }

        // check if room exists with this roomId api request 



        if (roomId != currentRoom?.roomId) {
            router.push('/');
            return;
        }
    }

    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
    }

    useEffect(() => {
        validateRoomExistance();
    }, [roomId, currentRoom]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoader(false);
            document.body.style.overflowY = "auto";
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, []);




    return (
        <div className="h-screen flex items-center justify-center">

            <Editor
                onMount={handleEditorDidMount}
                theme="vs-dark"
                height="100vh"
                width="100vw"
                language="javascript"
                value={editorText}
                onChange={(value) => handleEditorOnChange(value ?? "")}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />

            {/* {typeof roomId == "string" && <CodeEditor roomId={roomId} />} */}
        </div>
    );
}
