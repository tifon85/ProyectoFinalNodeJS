import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT
export const mongo_uri = process.env.MONGO_URI
export const google_client_id = process.env.GOOGLE_CLIENT_ID
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET
export const github_client_id = process.env.GITHUB_CLIENT_ID
export const github_client_secret = process.env.GITHUB_CLIENT_SECRET
export const secret_jwt = process.env.SECRET_KEY_JWT
export const twilio_account_sid=process.env.TWILIO_ACCOUNT_SID
export const twilio_auth_token=process.env.TWILIO_AUTH_TOKEN
export const twilio_phone_number=process.env.TWILIO_PHONE_NUMBER
export const nodemailer_user=process.env.NODEMAILER_USER
export const nodemailer_password=process.env.NODEMAILER_PASSWORD
export const verificationLink=process.env.VERIFICATION_LINK