import crypto from "crypto";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


const generateRoomId = (length = 6) => {
    let id = "";

    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        id += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return id;
}


export { generateRoomId }