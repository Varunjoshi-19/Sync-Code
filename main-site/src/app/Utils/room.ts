import crypto from "crypto";
import { RoomDetailsType, UserInfo } from "../Interfaces";
import { ALPHABET, defaultLangType, EditorTheme, listOfRooms, membersLimit, names } from "../constants";


class RoomHelper {

     handleGenerateCred = (name: string): UserInfo => {
          const username = name.trim();
          let sanitizedName = "";
          for (const char of username) {
               if (char == " ") {
                    sanitizedName += "-";
                    continue;
               }
               sanitizedName += char;
          }

          const user = {
               id: this.generateRandomId(),
               name: name,
               email: `${sanitizedName}@codesync.com`

          }

          localStorage.setItem("user-detail", JSON.stringify(user));
          return user;

     }

     handleGenerateRoom = (details: any, id: string = ""): RoomDetailsType => {
          const roomId = id || this.generateRoomId();
          const time24 = 24 * 3600 * 1000;

          const roomDetails: RoomDetailsType = {
               roomId: roomId,
               joinedMembers: [],
               owner: details.name,
               ownerId: details.id,
               roomName: this.generateRoomName(),
               expirationTime: Date.now() + time24,
               roomTextCode: "",
               configSettings: {
                    languageType: defaultLangType,
                    themeType: EditorTheme[0],
                    membersLimit: membersLimit
               }
          }

          return roomDetails;
     }

     generateRandomId(length = 30) {
          var chars =
               "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");

          if (!length) {
               length = Math.floor(Math.random() * chars.length);
          }

          var str = "";
          for (var i = 0; i < length; i++) {
               str += chars[Math.floor(Math.random() * chars.length)];
          }
          return str;
     }

     assignRandomName = () => {
          const index = Math.floor(Math.random() * names.length);
          return names[index];
     }

     generateRoomId = (length = 6) => {
          let roomId = "";
          const randomBytes = crypto.randomBytes(length);

          for (let i = 0; i < length; i++) {
               roomId += ALPHABET[randomBytes[i] % ALPHABET.length];
          }

          return roomId;
     }

     generateRoomName = () => {
          const index = Math.floor(Math.random() * listOfRooms.length);
          return listOfRooms[index];
     }

}


const roomHelper = new RoomHelper();
export { roomHelper }


