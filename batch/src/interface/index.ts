export interface RoomType {
    roomId: string;
    roomName: string;
    ownerId: string;
    owner: string;
    expirationTime: number;
    roomTextCode: string;
    joinedMembers: {
        socketId: string;
        userId: string;
    }[];
    configSettings: ConfigSettingsType;

}

export interface ConfigSettingsType {
    languageType: SupportedLangType;
    themeType: EditorThemeType,
    membersLimit: number;

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


export interface RoomExistancePayload {

    userId: string;
    roomId: string;
    socketId: string;
}
