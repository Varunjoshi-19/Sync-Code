import crypto from "crypto";
import { RoomDetailsType, UserInfo } from "../Interfaces";
import { defaultLangType, EditorTheme, membersLimit } from "../constants";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const names = [
     "James", "Michael", "Robert", "John", "David",
     "William", "Joseph", "Thomas", "Charles", "Daniel",
     "Matthew", "Anthony", "Mark", "Donald", "Steven",
     "Paul", "Andrew", "Joshua", "Kenneth", "Kevin",
     "Brian", "George", "Edward", "Ronald", "Timothy",
     "Jason", "Jeffrey", "Ryan", "Jacob", "Gary",
     "Nicholas", "Eric", "Jonathan", "Stephen", "Larry",
     "Justin", "Scott", "Brandon", "Benjamin", "Samuel",
     "Gregory", "Frank", "Alexander", "Raymond", "Patrick",
     "Jack", "Dennis", "Jerry", "Tyler", "Aaron"
];

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
               joinedMembers: 1,
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


