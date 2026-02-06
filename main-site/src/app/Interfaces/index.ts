import { Socket } from "socket.io-client";

export type RoomDetailsType = {
    roomId: string;
    roomName: string;
    ownerId: string;
    owner: string;
    expirationTime: number;
    joinedMembers: number;
};

export type RoomStore = {
    currentRoom: RoomDetailsType | null;
    roomError : string | null; 
    editorText : string;
    setEditorText : (text : string) => void;
    setRoomError : (error : string | null) => void;
    setCurrentRoom: (room: RoomDetailsType | null) => void;
    clearRoom: () => void;
};

export interface ModalInfo {

    type : string;
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
    setLoader: React.Dispatch<React.SetStateAction<boolean>>;
    editorText : string;

    editorRef : React.MutableRefObject<any>;
    handleEditorOnChange : (value : string) => void;


}