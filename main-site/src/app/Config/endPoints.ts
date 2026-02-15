const fallbackUrl = "http://localhost:4000";
// const fallbackUrl = "http://192.168.1.4:4000";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL! || fallbackUrl;
const BASE_URL = `${BACKEND_URL}/api`;
const BASE_URL2 = `${BACKEND_URL}/protected`;

const ApiEndPoints = {
    getTextCode: `${BASE_URL}/populate-document`,
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
    validate: `${BASE_URL}/validate`,
    register: `${BASE_URL}/register`,
    allRooms: `${BASE_URL2}/all-rooms`
};

export { ApiEndPoints, BACKEND_URL };