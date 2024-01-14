import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  secret_jwt: process.env.SECRET_KEY_JWT
};