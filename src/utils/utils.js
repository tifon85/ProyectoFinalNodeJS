// _dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret_jwt } from "../config/dotenv.config.js"

//hash para cifrar las password
export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};
  
//verificar si la password coincide
export const compareData = async (data, hashedData) => {
  return bcrypt.compare(data, hashedData);
};

//generar token - jwt
export const generateToken = (user) => {
  const token = jwt.sign(user, secret_jwt, { expiresIn: "1h" });
  return token;
};

//generar token - jwt restart password
export const generateTokenRestartPassword = (values) => {
  const token = jwt.sign(values, secret_jwt, { expiresIn: "1h" });
  return token;
};

//generar token - jwt
/*export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret_jwt, (err, payload) => {
      if (err) {
        return reject(err)
      }

      return resolve(payload)
    })
  })
}*/

export const __dirname = dirname(fileURLToPath(import.meta.url));