import crypto from "crypto";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const generateRoomId = (length = 6) => {
    let id = "";

    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        id += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return id;
}


function getMonthName(monthIndex: number): string {
    return MONTHS[monthIndex] ?? "";
}


function pad2(value: number): string {
    return String(value).padStart(2, "0");
}



export { generateRoomId, getMonthName, pad2 }