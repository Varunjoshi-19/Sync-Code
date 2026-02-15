"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCodeBaseDetails = exports.generateRoomName = exports.handleUserLeft = exports.handleCreateRoomId = void 0;
exports.updateRoom = updateRoom;
exports.updateSettings = updateSettings;
const _1 = require(".");
const room_1 = require("../cache/room");
const connection_1 = require("../database/connection");
const index_1 = require("./index");
const listOfRooms = [
    "Chill Zone",
    "Midnight Lounge",
    "Code Cave",
    "Pixel Palace",
    "Vibe Station",
    "The Hangout",
    "Cosmic Chat",
    "The Dev Den",
    "Late Night Talks",
    "Neon Room",
    "Dream Hub",
    "The Coffee Club",
    "Digital Campfire",
    "Brainstorm Bay",
    "The Think Tank",
    "After Hours",
    "Skyline Room",
    "Infinite Loop",
    "Zen Space",
    "The Playground",
    "Galaxy Hub",
    "The Lab",
    "Cloud Nine",
    "Focus Room",
    "Creative Corner",
    "The Basement",
    "The Attic",
    "Alpha Room",
    "Beta Room",
    "Gamma Lounge",
    "Delta Den",
    "Omega Space",
    "The Sandbox",
    "Chatter Box",
    "Echo Chamber",
    "The Dock",
    "Harbor Hangout",
    "Fireplace Talks",
    "The Retreat",
    "Sunset Lounge",
    "Moonlight Room",
    "Aurora Hub",
    "The Hive",
    "Spark Space",
    "The Loft",
    "Caffeine Corner",
    "Quiet Corner",
    "The Arena",
    "The Summit",
    "Open Space"
];
const handleCreateRoomId = () => {
    const roomId = (0, _1.generateRoomId)();
    if (room_1.createdRooms.has(roomId)) {
        const id = handleCreateRoomId();
        return id;
    }
    return roomId;
};
exports.handleCreateRoomId = handleCreateRoomId;
const generateRoomName = () => {
    const index = Math.floor(Math.random() * listOfRooms.length);
    return listOfRooms[index];
};
exports.generateRoomName = generateRoomName;
const handleUserLeft = (socket, socketId) => {
    if (!room_1.trackUsersRoom.has(socketId))
        return;
    const roomId = room_1.trackUsersRoom.get(socketId);
    if (!roomId)
        return;
    const currentRoom = room_1.createdRooms.get(roomId);
    if (!currentRoom)
        return;
    currentRoom.joinedMembers = currentRoom.joinedMembers.filter((member) => member.socketId !== socketId);
    room_1.createdRooms.set(roomId, currentRoom);
    room_1.trackUsersRoom.delete(socketId);
    socket.to(roomId).emit("user-left", { socketId: socket.id });
    CaptureRoomSnapShot(currentRoom);
};
exports.handleUserLeft = handleUserLeft;
const saveCodeBaseDetails = async (createdRoom) => {
    try {
        const { roomId, roomName, owner, roomTextCode, ownerId, configSettings } = createdRoom;
        const user = await connection_1.prisma.user.findUnique({
            where: { id: ownerId }
        });
        if (!user) {
            return false;
        }
        const title = createdTitle(Date.now());
        const roomData = {
            title: title,
            roomId,
            roomName,
            ownerId,
            owner,
            roomTextCode,
            configSettings,
        };
        await connection_1.prisma.rooms.create({
            data: roomData,
            include: { user: true }
        });
        return true;
    }
    catch (error) {
        console.log("error", error.message);
        return false;
    }
};
exports.saveCodeBaseDetails = saveCodeBaseDetails;
const CaptureRoomSnapShot = async (currentRoom) => {
    try {
        const { roomId, configSettings, roomTextCode } = currentRoom;
        await connection_1.prisma.rooms.update({
            where: { roomId: roomId },
            data: {
                configSettings: configSettings,
                roomTextCode,
                updatedAt: new Date(Date.now())
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
function createdTitle(time) {
    const now = new Date(time);
    const monthName = (0, index_1.getMonthName)(now.getMonth());
    const date = (0, index_1.pad2)(now.getDate());
    const hours12 = now.getHours() % 12 || 12;
    const hours = hours12?.toString().padStart(2, "0");
    const minutes = (0, index_1.pad2)(now.getMinutes());
    const format = now.getHours() >= 12 ? "PM" : "AM";
    return `${monthName} ${date} ${hours}:${minutes} ${format}`;
}
function updateRoom(roomId, updates) {
    const room = room_1.createdRooms.get(roomId);
    if (!room)
        return null;
    const updatedRoom = {
        ...room,
        ...updates,
    };
    room_1.createdRooms.set(roomId, updatedRoom);
    return updatedRoom;
}
function updateSettings(type, roomId, updatedSettings) {
    const room = room_1.createdRooms.get(roomId);
    if (!room)
        return null;
    if (type == "MEMBER") {
        const existing = room.joinedMembers.length;
        const newLimit = updatedSettings.membersLimit;
        if (existing > newLimit) {
            return room.configSettings.membersLimit;
        }
    }
    const updatedRoom = {
        ...room,
        configSettings: { ...room.configSettings, ...updatedSettings },
    };
    room_1.createdRooms.set(roomId, updatedRoom);
    return updatedRoom;
}
