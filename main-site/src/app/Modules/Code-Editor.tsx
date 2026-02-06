"use client";

import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
// import { MonacoBinding } from "y-monaco";

export default function CodeEditor({ roomId }: { roomId: string }) {
    const editorRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (!editorRef.current) return;

    //     const ydoc = new Y.Doc();

    //     const provider = new WebsocketProvider(
    //         "ws://localhost:4000",
    //         roomId,
    //         ydoc
    //     );

    //     const yText = ydoc.getText("monaco");

    //     const editor = monaco.editor.create(editorRef.current, {
    //         value: "",
    //         language: "javascript",
    //         theme: "vs-dark",
    //         automaticLayout: true,
    //     });

    //     const binding = new MonacoBinding(
    //         yText,
    //         editor.getModel()!,
    //         new Set([editor]),
    //         provider.awareness
    //     );

    //     return () => {
    //         provider.disconnect();
    //         ydoc.destroy();
    //         editor.dispose();
    //     };
    // }, [roomId]);

    useEffect(() => {
        if (!editorRef.current) return;

        monaco.editor.create(editorRef.current, {
            value: "",
            language: "javascript",
            theme: "vs-dark",
            automaticLayout: true,
        });
    }, [roomId]);

    return <div ref={editorRef} className="h-screen w-full" />;
}
