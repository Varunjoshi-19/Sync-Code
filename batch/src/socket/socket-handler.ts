import { Socket, Server } from "socket.io";
import { createdRooms, RoomType } from "../cache/room";
import { generateRoomName, handleCreateRoomId } from "../utils/room";

interface RoomExistancePayload {
    roomId: string;
    socketId: string;
}

class SocketHandler {

    initSocketHandler(socket: Socket, socketModel: Server) {

        socket.on("create-room", (details) => this.handleCreateRoom(socket, details));
        socket.on('check-room-existance', ({ roomId, socketId }: RoomExistancePayload) => {
            if (createdRooms.has(roomId)) {
                const room = createdRooms.get(roomId);
                socket.join(roomId);
                socketModel.to(socketId).emit("room-exists", room);
            } else {
                socketModel.to(socketId).emit("room-exists", null);
            }
        });

        socket.on("document-change", ({ currentRoom, textValue }: { currentRoom: RoomType; textValue: string }) => {

            const roomId = currentRoom.roomId;

            const updatedRoom = updateRoom(roomId, {
                roomTextCode: textValue,
            });

            if (!updatedRoom) return;

            console.log("document change:", updatedRoom);

            socket.to(roomId).emit("document-update", textValue);
        }
        );

    }


    handleCreateRoom(socket: Socket, details: { id: string, name: string, email: string }) {
        const roomId = handleCreateRoomId();

        const roomDetails: RoomType = {
            roomId: roomId,
            joinedMembers: 1,
            owner: details.name,
            ownerId: details.id,
            roomName: generateRoomName(),
            expirationTime: Date.now(),
            roomTextCode: ""
        }

        createdRooms.set(roomId, roomDetails);
        socket.join(roomId);
        console.log("created room", createdRooms);
        socket.emit("room-created", roomDetails);
    }

    handleWhenUserDisconnects(socketId: string) {

    }

}


function updateRoom(roomId: string, updates: Partial<RoomType>) {
    const room = createdRooms.get(roomId);
    if (!room) return null;

    const updatedRoom: RoomType = {
        ...room,
        ...updates,
    };

    createdRooms.set(roomId, updatedRoom);
    return updatedRoom;
}



export default SocketHandler;