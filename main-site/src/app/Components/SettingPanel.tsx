"use client";

import { allowedMembers, EditorTheme } from "../constants";
import { UseGlobalContext } from "../Context/GlobalContext";
import { SettingPanelProps, SettingsType } from "../Interfaces";
import { useRoomStore } from "../Store/store";

function SettingsPanel({ sidePanelInfo, onClose, supportedLanguage }: SettingPanelProps) {

    const { socket } = UseGlobalContext();
    const { currentRoom, updateRoomSettings, user } = useRoomStore();
    const { isOpen, type } = sidePanelInfo;

    const languageType = currentRoom?.configSettings?.languageType;
    const themeId = currentRoom?.configSettings?.themeType?.id;
    const langId = languageType?.id;
    const membersLimit = currentRoom?.configSettings.membersLimit;

    const handleSelectSyntax = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currentId = e.target.value;
        const modal = supportedLanguage.find((each) => String(each.id) === String(currentId));

        if (modal) {
            socket.emit("new-settings",
                {
                    type: SettingsType.LANG,
                    roomId: currentRoom?.roomId,
                    updatedSettings: { languageType: modal }
                });

            updateRoomSettings({ languageType: { ...modal } });

        }

    };

    const handleSelectTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currentId = e.target.value;
        const theme = EditorTheme.find((t) => String(t.id) === String(currentId));

        if (theme) {
            socket.emit("new-settings",
                {
                    type: SettingsType.EDITOR,
                    roomId: currentRoom?.roomId,
                    updatedSettings: { themeType: { ...theme } }
                });
            updateRoomSettings({ themeType: { ...theme } });
        }
    };

    const handleAllowMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e.target.value);
        socket.emit("new-settings",
            {
                type: SettingsType.MEMBER,
                roomId: currentRoom?.roomId,
                updatedSettings: { membersLimit: limit }
            });

        updateRoomSettings({ membersLimit: limit });
    }


    if (!currentRoom || !languageType || !themeId || !langId || !membersLimit) {
        return null;
    }



    return (
        <div
            className={`
                bg-white w-72 border-l border-slate-200 h-full
                transition-transform duration-200
                ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}>

            <div className="flex items-center justify-between p-4 ">
                {type == "SETTINGS" ? <span className="text-lg">Settings</span>
                    : <span>{""}</span>
                }
                <button className="cursor-pointer" onClick={onClose}>✕</button>
            </div>


            {type == "SETTINGS" &&
                <>

                    <div className="p-4 flex flex-col gap-4 text-sm">
                        <div>
                            <div className="mb-1 text-slate-500">Syntax</div>
                            <select onChange={handleSelectSyntax} value={langId} className="w-full border p-2">
                                {
                                    supportedLanguage.map((lang) => (
                                        <option key={lang.id} value={lang.id}>{lang.langName}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <div className="mb-1 text-slate-500">Allowed Members</div>
                            <select
                                disabled={currentRoom.ownerId !== user?.id}
                                onChange={handleAllowMember}
                                value={membersLimit}
                                className={`w-full border p-2 ${currentRoom.ownerId !== user?.id ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {allowedMembers.map((each) => (
                                    <option key={each}>{each}</option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <div className="mb-1 text-slate-500">Theme</div>
                            <select onChange={handleSelectTheme} value={themeId} className="w-full border p-2">
                                {
                                    EditorTheme.map((theme) => (
                                        <option key={theme.id} value={theme.id}>{theme.themeName}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </>

            }

            {
                type == "INFO" &&

                <div className="flex flex-col items-center px-4 gap-10">
                    <p>
                        👩🏻‍💻 Code Sync enables developers to share code in real-time.
                        Write or paste code in your browser,
                        share the URL, code in real-time with
                        friends and team mates.
                    </p>
                    <p>
                        🔨 Code Sync was built and maintained by
                        Varun Joshi
                    </p>

                </div>
            }


        </div>
    );
}


export default SettingsPanel