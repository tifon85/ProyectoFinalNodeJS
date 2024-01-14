import mongoose from "mongoose";
import { mongo_uri } from "../config/dotenv.config.js"

export const URI = mongo_uri;

mongoose
  .connect(URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error));