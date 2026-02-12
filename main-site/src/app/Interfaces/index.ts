import React from "react";
import { Socket } from "socket.io-client";

export type RoomDetailsType = {
    roomId: string;
    roomName: string;
    ownerId: string;
    owner: string;
    expirationTime: number;
    roomTextCode: string;
    joinedMembers: {
        socketId: string,
        userId: string
    }[];
    configSettings: ConfigSettingsType
};

export interface ConfigSettingsType {
    languageType: SupportedLangType;
    themeType: EditorThemeType,
    membersLimit: number;

}

export interface LayoutType {
    children: React.ReactNode
}


export interface UserInfo {
    id: string;
    fullName: string;
    email: string;
}
export interface Settings {
    languageType?: SupportedLangType;
    themeType?: EditorThemeType;
    membersLimit?: number;
}

export type RoomStore = {
    user: UserInfo | null,
    currentRoom: RoomDetailsType | null;
    roomError: string | null;
    loggedIn: boolean;


    setLoggedIn: (status: boolean) => void;
    setCurrentRoom: (room: RoomDetailsType) => void;
    setRoomError: (error: string | null) => void;
    setUser: (user: UserInfo | null) => void;
    clearRoom: () => void;
    updateRoomSettings: (settings: Settings) => void;

};
export interface ModalInfo {

    type: string;
    isOpen: boolean;
    title: string;
    description?: string;
    btnType: string;
    holder: string;
    callbackFun: (value: string) => void;
}
export interface ModalTypes {
    modalInfo: ModalInfo;
    closeModal: React.Dispatch<React.SetStateAction<ModalInfo | null>>;
}
export interface GlobalContextPayload {
    socket: Socket;
    editorRef: React.MutableRefObject<any>;
    handleEditorOnChange: (value: string) => void;
    handleUpdateEditor: (incommingText: string) => void;


}
export interface ShareDilogBoxType {
    open: boolean,
    url: string;
}

export type SideBarProps = {
    onSettings: () => void;
    onDownload: () => void;
    onInfo: () => void;
};
export interface IconButtonType {
    icon: any;
    label: string;
    onClick: () => void;
    key: string;
}

export interface SupportedLangType {
    id: string;
    langName: string;
    ext: string;
}

export interface EditorThemeType {
    id: string;
    themeName: string;
}

export interface SettingPanelProps {
    sidePanelInfo: PanelInfo,
    supportedLanguage: SupportedLangType[],
    onClose: () => void;
}

export interface PanelInfo {
    type: string;
    isOpen: boolean;
}

export enum SettingsType {
    LANG = "LANG",
    EDITOR = "EDITOR",
    MEMBER = "MEMBER",
}

export type SettingType = SettingsType;
export type OptionType = "CREATE" | "JOIN";