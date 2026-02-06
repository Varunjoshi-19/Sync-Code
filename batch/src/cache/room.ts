export interface RoomType {
    roomId: string;
    roomName: string;
    ownerId: string;
    owner: string;
    expirationTime: number;
    joinedMembers: number;

    roomTextCode : string;

}

const createdRooms = new Map<string, RoomType>();


export { createdRooms }