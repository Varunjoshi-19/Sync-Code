"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("../cache/room");
const room_2 = require("../utils/room");
const connection_1 = require("../database/connection");
class SocketHandler {
    constructor() {
        this.handleCheckRoomExist = async (socketId, roomId) => {
            try {
                const result = await connection_1.prisma.rooms.update({
                    where: { roomId: roomId },
                    data: { updatedAt: new Date() },
                    include: { user: true }
                });
                if (!result)
                    return null;
                const settings = result.configSettings;
                const time24 = 24 * 3600 * 1000;
                const roomDetails = {
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
                };
                return roomDetails;
            }
            catch (error) {
                return null;
            }
        };
    }
    initSocketHandler(socket, socketModel) {
        socket.on("create-room", ({ createdRoom }) => this.handleCreateRoom(socket, createdRoom));
        socket.on('check-room-existance', async ({ userId, roomId, socketId }) => {
            if (room_1.createdRooms.has(roomId)) {
                this.handleJoinExistingRoom(userId, roomId, socketId, socket, socketModel);
            }
            else {
                // check in db stopped rooms and make them active and alive
                const room = await this.handleCheckRoomExist(socketId, roomId);
                if (room != null) {
                    room_1.createdRooms.set(roomId, room);
                    room_1.trackUsersRoom.set(socketId, roomId);
                    socket.join(roomId);
                    socketModel.to(socketId).emit("room-exists", room);
                }
                else {
                    socketModel.to(socketId).emit("room-exists", null);
                }
            }
        });
        socket.on("document-change", ({ currentRoom, textValue }) => {
            const roomId = currentRoom.roomId;
            const updatedRoom = (0, room_2.updateRoom)(roomId, {
                roomTextCode: textValue,
            });
            if (!updatedRoom)
                return;
            socket.to(roomId).emit("document-update", textValue);
        });
        // direct from the browser URL with /room/roomId
        socket.on("direct-room", async ({ userId, createdRoom }) => {
            const { roomId } = createdRoom;
            const socketId = socket.id;
            //  first check in memory running rooms 
            if (room_1.createdRooms.has(roomId)) {
                this.handleJoinExistingRoom(userId, roomId, socket.id, socket, socketModel);
            }
            // then check in db if has any stopped rooms 
            else {
                const room = await this.handleCheckRoomExist(socketId, roomId);
                if (room != null) {
                    room_1.createdRooms.set(roomId, room);
                    room_1.trackUsersRoom.set(socketId, roomId);
                    socket.join(roomId);
                    socketModel.to(socketId).emit("room-exists", room);
                    // not in memory and db that means that room data from client side and make them alive.
                }
                else {
                    if (!createdRoom)
                        return;
                    this.handleCreateRoom(socket, createdRoom);
                }
            }
        });
        socket.on("new-settings", ({ type, roomId, updatedSettings }) => {
            const updatedRoom = (0, room_2.updateSettings)(type, roomId, updatedSettings);
            if (!updatedRoom)
                return;
            if (typeof updatedRoom == "number") {
                socketModel.to(socket.id).emit("settings-failed", {
                    limit: updatedRoom,
                    message: "Existing member is more than limit !!"
                });
                return;
            }
            socket.to(roomId).emit("updated-settings", { type, updatedSettings });
        });
        socket.on("cursor-move", ({ socketId, selection, roomId }) => {
            socket.to(roomId).emit("cursor-move", { socketId, selection });
        });
        socket.on("leave-room", ({ socketId }) => (0, room_2.handleUserLeft)(socket, socketId));
    }
    handleCreateRoom(socket, createdRoom) {
        const { roomId, ownerId } = createdRoom;
        let room = { ...createdRoom, joinedMembers: [{ socketId: socket.id, userId: ownerId }] };
        room_1.createdRooms.set(roomId, room);
        room_1.trackUsersRoom.set(socket.id, roomId);
        socket.join(roomId);
        socket.emit("room-created", createdRoom);
        // save created rooms in the db if the user exists like if id exists 
        (0, room_2.saveCodeBaseDetails)(createdRoom);
    }
    handleJoinExistingRoom(userId, roomId, socketId, socket, socketModel) {
        const room = room_1.createdRooms.get(roomId);
        const limit = room.configSettings.membersLimit;
        const members = room.joinedMembers.length;
        if (members + 1 > limit) {
            socketModel.to(socketId).emit("room-full");
        }
        else {
            room.joinedMembers.push({ socketId, userId });
            room_1.createdRooms.set(roomId, room);
            room_1.trackUsersRoom.set(socketId, roomId);
            socket.join(roomId);
            socketModel.to(socketId).emit("room-exists", room);
        }
    }
}
exports.default = SocketHandler;
