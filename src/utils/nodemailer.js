import nodemailer from "nodemailer";
import { nodemailer_password, nodemailer_user } from "../config/dotenv.config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: nodemailer_user,
    pass: nodemailer_password,
  },
});