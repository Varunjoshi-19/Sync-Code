const fallbackUrl = "http://localhost:4000";
const BACKEND_URL = process.env.BACKEND_URL || fallbackUrl;

const BASE_URL = `${BACKEND_URL}/api`;

const ApiEndPoints = {
    getTextCode : `${BASE_URL}/populate-document`
};

export { ApiEndPoints, BACKEND_URL };