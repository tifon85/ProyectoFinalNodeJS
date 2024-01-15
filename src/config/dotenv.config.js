import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT
export const mongo_uri = process.env.MONGO_URI
export const google_client_id = process.env.GOOGLE_CLIENT_ID
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET
export const github_client_id = process.env.GITHUB_CLIENT_ID
export const github_client_secret = process.env.GITHUB_CLIENT_SECRET
export const secret_jwt = process.env.SECRET_KEY_JWT