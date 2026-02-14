import dotenv from "dotenv";
dotenv.config();

const config = {
     
accessKey : process.env.JWT_SECRET!,
refreshKey : process.env.JWT_REFRESH_SECRET!

}

export {  config }