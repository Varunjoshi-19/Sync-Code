import { generateRoomId } from ".";
import { createdRooms, trackUsersRoom } from "../cache/room";
import { prisma } from "../database/connection";
import { RoomType } from "../interface/index";
import { getMonthName, pad2 } from "./index";
import { Socket } from "socket.io";


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

const handleCreateRoomId = (): string => {
    const roomId = generateRoomId();
    if (createdRooms.has(roomId)) {
        const id = handleCreateRoomId();
        return id;
    }

    return roomId;
}

const generateRoomName = () => {
    const index = Math.floor(Math.random() * listOfRooms.length);
    return listOfRooms[index];
}

const handleUserLeft = (socket: Socket, socketId: string) => {
    if (!trackUsersRoom.has(socketId)) return;

    const roomId = trackUsersRoom.get(socketId);
    if (!roomId) return;

    const currentRoom = createdRooms.get(roomId);
    if (!currentRoom) return;

    currentRoom.joinedMembers = currentRoom.joinedMembers.filter(
        (member) => member.socketId !== socketId
    );

    createdRooms.set(roomId, currentRoom);
    trackUsersRoom.delete(socketId);
    socket.to(roomId).emit("user-left", { socketId: socket.id });

    CaptureRoomSnapShot(currentRoom);

};

const saveCodeBaseDetails = async (createdRoom: RoomType) => {
    try {
        const { roomId, roomName, owner, roomTextCode, ownerId, configSettings } = createdRoom;

        const user = await prisma.user.findUnique({
            where: { id: ownerId }
        });

        if (!user) {
            return false;
        }

        const title: string = createdTitle(Date.now());

        const roomData: any = {
            title: title,
            roomId,
            roomName,
            ownerId,
            owner,
            roomTextCode,
            configSettings,
        }

        await prisma.rooms.create({
            data: roomData,
            include: { user: true }

        });

        return true;

    } catch (error: any) {
        console.log("error", error.message);
        return false;
    }

}

const CaptureRoomSnapShot = async (currentRoom: RoomType) => {
    try {
        const { roomId, configSettings, roomTextCode } = currentRoom;
        await prisma.rooms.update({
            where: { roomId: roomId },
            data: {
                configSettings: configSettings as any,
                roomTextCode,
                updatedAt: new Date(Date.now())
            }
        });


    } catch (error) {
        console.log(error);
    }
}

function createdTitle(time: number): string {
    const now = new Date(time);

    const monthName = getMonthName(now.getMonth());
    const date = pad2(now.getDate());
    const hours12 = now.getHours() % 12 || 12;
    const hours = hours12?.toString().padStart(2, "0");
    const minutes = pad2(now.getMinutes());

    const format = now.getHours() >= 12 ? "PM" : "AM";

    return `${monthName} ${date} ${hours}:${minutes} ${format}`;
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

function updateSettings(type: string, roomId: string, updatedSettings: any): RoomType | number | null {
    const room = createdRooms.get(roomId);
    if (!room) return null;

    if (type == "MEMBER") {
        const existing = room.joinedMembers.length;
        const newLimit = updatedSettings.membersLimit;
        if (existing > newLimit) {
            return room.configSettings.membersLimit;
        }
    }

    const updatedRoom: RoomType = {
        ...room,
        configSettings: { ...room.configSettings, ...updatedSettings },
    };

    createdRooms.set(roomId, updatedRoom);
    return updatedRoom;
}



export {
    handleCreateRoomId,
    handleUserLeft,
    generateRoomName,
    updateRoom,
    updateSettings,
    saveCodeBaseDetails
}

