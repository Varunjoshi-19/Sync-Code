import { create } from "zustand";
import { RoomStore, Settings } from "../Interfaces";
import { EditorTheme, defaultLangType } from "../constants";

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  roomError: null,
  user: null,
  loggedIn: false,

  selectedTheme: EditorTheme[0],
  selectedLang: defaultLangType,

  setUser: (user) => set({ user: user }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRoomError: (error) => set({ roomError: error }),
  setLoggedIn: (status) => set({ loggedIn: status }),


  updateRoomSettings: (settings: Settings) =>
    set((state) => ({
      currentRoom: state.currentRoom
        ? {
          ...state.currentRoom,
          configSettings: {
            ...state.currentRoom.configSettings,
            ...settings,
          },
        }
        : null,
    })),




  clearRoom: () => set({ currentRoom: null }),
}));
