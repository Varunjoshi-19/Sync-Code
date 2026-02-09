"use client";

import toast from "react-hot-toast";
import { UseGlobalContext } from "../Context/GlobalContext";
import { useRoomStore } from "../Store/store";
import { helper } from "../Utils";
import { roomHelper } from "../Utils/room";


const useRoom = () => {

    const { user, setCurrentRoom } = useRoomStore();
    const { socket, setLoader } = UseGlobalContext();

    const { handleGenerateRoom } = roomHelper;
    const { handleGetUserFromLocal } = helper;


    const handleCreateRoom = () => {
        const details = user ?? handleGetUserFromLocal();
        if (!details || !socket.id) {
            toast.error("Socket Id or user details missing !!");
            return;
        }
        const createdRoom = handleGenerateRoom(details);
        setCurrentRoom(createdRoom);
        socket.emit("create-room", { createdRoom });

        document.body.style.overflow = "hidden";
        setLoader(true);
    };



    return {
        handleCreateRoom
    }

}

export default useRoom;
