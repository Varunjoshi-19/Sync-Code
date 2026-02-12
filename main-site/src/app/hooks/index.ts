"use client";

import toast from "react-hot-toast";
import { useRoomStore } from "../Store/store";
import { roomHelper } from "../Utils/room";
import { helper } from "../Utils";

type UseRoomParams = {
    socket: any;
    setLoader: (v: boolean) => void;
  };
  
  const useRoom = ({ socket, setLoader }: UseRoomParams) => {
    const { user, setCurrentRoom } = useRoomStore();
    const { handleGenerateRoom } = roomHelper;
    const { handleGetUserFromLocal } = helper;
  
    const handleCreateRoom = () => {
      const details = user ?? handleGetUserFromLocal();
  
      if (!details || !socket?.id) {
        toast.error("Socket Id or user details missing !!");
        return;
      }
  
      const createdRoom = handleGenerateRoom(details);
      setCurrentRoom(createdRoom);
      socket.emit("create-room", { createdRoom });
  
      document.body.style.overflow = "hidden";
      setLoader(true);
    };
  
    return { handleCreateRoom };
  };
  
  export default useRoom;
  