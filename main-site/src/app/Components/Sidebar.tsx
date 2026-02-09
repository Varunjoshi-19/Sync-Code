"use client";

import { Settings, Download, Plus, Info } from "lucide-react";
import { IconButtonType, SideBarProps } from "../Interfaces";
import useRoom from "../hooks";
import { UseGlobalContext } from "../Context/GlobalContext";

function IconButton({ icon, label, onClick }: IconButtonType) {

    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className="text-slate-400 hover:text-white transition cursor-pointer"
            >
                {icon}
            </button>

            <div
                className="absolute right-full ml-2 top-1/2 -translate-y-1/2
                    bg-slate-800 text-white text-xs px-2 py-1 rounded
                    opacity-0 group-hover:opacity-100 transition
                    whitespace-nowrap pointer-events-none z-50"
            >
                {label}
            </div>

        </div>
    );
}

export default function Sidebar({ onSettings, onDownload, onInfo }: SideBarProps) {

    const { handleCreateRoom } = useRoom();
    const { setEditorText } = UseGlobalContext();

    const createRoom = () => {
        setEditorText("");
        handleCreateRoom();

    }

    const IconButtons = [
        { icon: Settings, label: "Settings", callback: onSettings },
        { icon: Download, label: "Download", callback: onDownload },
        { icon: Plus, label: "Create a New Code-Sync", callback: createRoom },

    ];

    return (
        <div className="h-full w-14 bg-slate-900 border-l border-slate-800 flex flex-col min-h-0">

            <div className="flex-1 flex flex-col">

                <div className="flex flex-col gap-6 pt-4 items-center">

                    {IconButtons.map((each) => {
                        const Icon = each.icon;
                        return (
                            <IconButton
                                key={each.label}
                                icon={<Icon className="w-5 h-5" />}
                                label={each.label}
                                onClick={each.callback}
                            />

                        )
                    })}
                </div>

                <div className="mt-auto pb-4 flex justify-center">
                    <IconButton
                        key={"Info"}
                        icon={<Info className="w-5 h-5" />}
                        label="Info"
                        onClick={onInfo}
                    />
                </div>
            </div>
        </div>
    );
}
