import { create } from "zustand";
import { ShareDilogBoxType } from "../Interfaces";

interface GlobalStorePayload {
    loader: boolean,
    shareDilog: ShareDilogBoxType | null,
    editorText: string,
    showPricingPopup: boolean,

    setLoader: (value: boolean) => void;
    setShareDilog: (dilog: ShareDilogBoxType | null) => void;
    setShowPricingPopup: (value: boolean) => void;
    setEditorText : (text : string) => void;

}
export const useGlobalStore = create<GlobalStorePayload>((set) => ({

    loader: false,
    shareDilog: null,
    editorText: "",
    showPricingPopup: false,


    setLoader: (value: boolean) => set({ loader: value }),
    setEditorText: (text: string) => set({ editorText: text }),
    setShowPricingPopup: (value: boolean) => set({ showPricingPopup: value }),
    setShareDilog: (dilog: ShareDilogBoxType | null) => set({ shareDilog: dilog })

}));  