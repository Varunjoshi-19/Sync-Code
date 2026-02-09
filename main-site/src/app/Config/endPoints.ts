// const fallbackUrl = "http://localhost:4000";
// const BACKEND_URL = process.env.BACKEND_URL || fallbackUrl;
const BACKEND_URL = "https://5930-49-156-77-134.ngrok-free.app";

const BASE_URL = `${BACKEND_URL}/api`;

const ApiEndPoints = {
    getTextCode : `${BASE_URL}/populate-document`
};

export { ApiEndPoints, BACKEND_URL };