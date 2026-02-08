import { Socket, Server } from "socket.io";
import { createdRooms, RoomType } from "../cache/room";

interface RoomExistancePayload {
    roomId: string;
    socketId: string;
}

class SocketHandler {

    initSocketHandler(socket: Socket, socketModel: Server) {

        socket.on("create-room", ({ createdRoom }) => this.handleCreateRoom(socket, createdRoom));

        socket.on('check-room-existance', ({ roomId, socketId }: RoomExistancePayload) => {
            if (createdRooms.has(roomId)) {
                this.handleJoinExistingRoom(roomId, socketId, socket, socketModel);
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
            socket.to(roomId).emit("document-update", textValue);
        }
        );

        socket.on("direct-room", ({ createdRoom }: { createdRoom: RoomType }) => {

            const { roomId } = createdRoom;

            if (createdRooms.has(roomId)) {
                this.handleJoinExistingRoom(roomId, socket.id, socket, socketModel);
            }
            else {
                this.handleCreateRoom(socket, createdRoom);
            }
        })

        socket.on("new-settings", ({ type, roomId, updatedSettings }: { type: string, roomId: string, updatedSettings: any }) => {
            const updatedRoom = updateRoom(roomId, updatedSettings);
            if (!updatedRoom) return;
            socket.to(roomId).emit("updated-settings", { type, updatedSettings });
        });

    }

    handleCreateRoom(socket: Socket, createdRoom: RoomType) {
        const { roomId } = createdRoom;
        createdRooms.set(roomId, createdRoom);
        socket.join(roomId);
        socket.emit("room-created", createdRoom);
    }

    handleJoinExistingRoom(roomId: string, socketId: string, socket: Socket, socketModel: Server) {
        const room = createdRooms.get(roomId);
        socket.join(roomId);
        socketModel.to(socketId).emit("room-exists", room);
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