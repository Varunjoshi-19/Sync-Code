import { Socket, Server } from "socket.io";
import { RoomExistancePayload, RoomType } from "../interface/index";
import { createdRooms, trackUsersRoom } from "../cache/room";
import { handleUserLeft, updateRoom, updateSettings } from "../utils/room";
import { prisma } from "../database/connection";


class SocketHandler {

    initSocketHandler(socket: Socket, socketModel: Server) {

        socket.on("create-room", ({ createdRoom }) => this.handleCreateRoom(socket, createdRoom));

        socket.on('check-room-existance', async ({ userId, roomId, socketId }: RoomExistancePayload) => {
            if (createdRooms.has(roomId)) {
                this.handleJoinExistingRoom(userId, roomId, socketId, socket, socketModel);

            } else {
                // check in db stopped rooms and make them active and alive
                const room = await this.handleCheckRoomExist(socketId, roomId);
                if (room != null) {
                    createdRooms.set(roomId, room);
                    trackUsersRoom.set(socketId, roomId);
                    socket.join(roomId);
                    socketModel.to(socketId).emit("room-exists", room);
                } else {
                    socketModel.to(socketId).emit("room-exists", null);
                }

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

        // direct from the browser URL with /room/roomId
        socket.on("direct-room", async ({ userId, createdRoom }: { userId: string, createdRoom: RoomType }) => {

            const { roomId } = createdRoom;
            const socketId = socket.id;

            //  first check in memory running rooms 
            if (createdRooms.has(roomId)) {
                this.handleJoinExistingRoom(userId, roomId, socket.id, socket, socketModel);
            }
            // then check in db if has any stopped rooms 
            else {
                const room = await this.handleCheckRoomExist(socketId, roomId);
                if (room != null) {
                    createdRooms.set(roomId, room);
                    trackUsersRoom.set(socketId, roomId);
                    socket.join(roomId);
                    socketModel.to(socketId).emit("room-exists", room);

                    // not in memory and db that means that room data from client side and make them alive.
                } else {
                    if (!createdRoom) return;
                    this.handleCreateRoom(socket, createdRoom);
                }
            }
        })

        socket.on("new-settings", ({ type, roomId, updatedSettings }: { type: string, roomId: string, updatedSettings: any }) => {

            const updatedRoom = updateSettings(type, roomId, updatedSettings);
            if (!updatedRoom) return;
            if (typeof updatedRoom == "number") {
                socketModel.to(socket.id).emit("settings-failed",
                    {
                        limit: updatedRoom,
                        message: "Existing member is more than limit !!"
                    });
                return;
            }
            socket.to(roomId).emit("updated-settings", { type, updatedSettings });
        });

        socket.on("leave-room", ({ socketId }) => handleUserLeft(socketId));

    }

    handleCreateRoom(socket: Socket, createdRoom: RoomType) {
        const { roomId, ownerId } = createdRoom;
        let room = { ...createdRoom, joinedMembers: [{ socketId: socket.id, userId: ownerId }] }
        createdRooms.set(roomId, room);
        trackUsersRoom.set(socket.id, roomId);
        socket.join(roomId);
        socket.emit("room-created", createdRoom);
    }

    handleJoinExistingRoom(userId: string, roomId: string, socketId: string, socket: Socket, socketModel: Server) {
        const room = createdRooms.get(roomId);
        const limit = room!.configSettings.membersLimit;
        const members = room!.joinedMembers.length;
        if (members + 1 > limit) {
            socketModel.to(socketId).emit("room-full");
        } else {
            room!.joinedMembers.push({ socketId, userId });
            createdRooms.set(roomId, room!);
            trackUsersRoom.set(socketId, roomId);
            socket.join(roomId);
            socketModel.to(socketId).emit("room-exists", room);
        }

    }

    handleCheckRoomExist = async (socketId: string, roomId: string) => {
        try {
            const result = await prisma.rooms.findUnique({
                where: { roomId: roomId },
                include: { user: true }
            });
            if (!result) return null;

            const settings: any = result.configSettings;
            const time24 = 24 * 3600 * 1000;

            const roomDetails: RoomType = {
                roomId: result.roomId,
                roomName: result.roomName,
                roomTextCode: result.roomTextCode,
                owner: result.owner,
                ownerId: result.ownerId,
                expirationTime: Date.now() + time24,
                joinedMembers: [{ socketId, userId: result.user.id }],
                configSettings: {
                    languageType: settings.languageType,
                    themeType: settings.themeType,
                    membersLimit: settings.membersLimit
                }
            }

            return roomDetails;
        } catch (error) {
            return null;
        }
    }

}


export default SocketHandler;