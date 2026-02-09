import { RoomType } from "../interface";

const createdRooms = new Map<string, RoomType>();
const trackUsersRoom  = new Map<string , string>();


export { createdRooms , trackUsersRoom }