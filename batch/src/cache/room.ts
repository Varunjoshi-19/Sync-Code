export interface RoomType {
    roomId: string;
    roomName: string;
    ownerId: string;
    owner: string;
    expirationTime: number;
    roomTextCode: string;
    joinedMembers: number;
    configSettings: {
        languageType: SupportedLangType;
        themeType: EditorThemeType,
        membersLimit: number;

    }

}

export interface SupportedLangType {
    id: string;
    langName: string;
    ext: string;
}

export interface EditorThemeType {
    id: string;
    themeName: string;
}

const createdRooms = new Map<string, RoomType>();


export { createdRooms }