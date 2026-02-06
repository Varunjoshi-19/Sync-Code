import { create } from "zustand";
import { RoomStore } from "../Interfaces";

export const useRoomStore = create<RoomStore>((set) => ({
    currentRoom: null,
    roomError : null,
    editorText : "",
    setCurrentRoom: (room) => set({ currentRoom: room }),
    setEditorText : (text) => set({editorText : text}),
    setRoomError : (error) => set({roomError : error}),
    clearRoom: () => set({ currentRoom: null }),
}));
