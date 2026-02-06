import { generateRoomId } from ".";
import { createdRooms } from "../cache/room";

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

export { handleCreateRoomId , generateRoomName }

