import nodemailer from "nodemailer";
import { nodemailer_password, nodemailer_user } from "../config/dotenv.config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure:false,
  auth: {
    user: 'nico.ten85@gmail.com',//nodemailer_user,
    pass: 'sqxo piev qibz zhqn',//nodemailer_password,
  },
  tls:{
    rejectUnauthorized:false
  }
});