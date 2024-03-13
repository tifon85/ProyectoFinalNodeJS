import { UserManager } from "../Dao/UserManager.js";
import { CartManager } from "../Dao/CartManager.js";
import { userDTO } from "../Dao/DTOs/user.dto.js";
import { hashData, compareData, generateTokenSession, generateTokenMailPassword } from "../utils.js";
import { verificationLink } from "../config/dotenv.config.js"
import { transporter } from "../utils/nodemailer.js";

const userManager = new UserManager()
const cartManager = new CartManager()

export class UserService{

    //funcion para crear el carrito vacio
    registerUserService = async (user) => {
        try{
            user.password = await hashData(user.password);
            const userdto = new userDTO(user)
            const response = await userManager.createUser(userdto);
            return response;
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por email
    getUserByEmailService = async (email) => {
        try{
            const user = await userManager.getUserByEmail(email)
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por id
    getUserByIdService = async (id) => {
        try{
            const user = await userManager.getUserById(id)
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    isPasswordValidService = async (password, currentPassword) => {
        try{
            const isPasswordValid = await compareData(password, currentPassword);
            return isPasswordValid
        }catch(error){
            throw new Error(error.message)
        }
    }

    forgotPassword = async (email) => {
        
        try{
            const token = generateTokenMailPassword( {email} )

            //Envio de mail para recuperar password
            const mailOptions = {
                from: "nico.ten85@gmail.com",
                to: email,
                subject: `Recupero de contraseña`,
                text: `http://localhost:8080/api/views/restaurarPassword/`,
            };
            await transporter.sendMail(mailOptions);
            res.send("Email enviado");

        }catch(error){
            throw new Error(error.message)
        }
    }

    restaurarPasswordService = async (password, user) => {
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        const userdto = new userDTO(user)
        return await userManager.updateUser(user._id, userdto);
    }

    loginUserService = async (user) => {
        const cartID = user.cart._id
        const { first_name, last_name, role, email } = user;
        const token = generateTokenSession({ first_name, last_name, email, role, cartID });
        return token
    }

    updateRole = async (user) => {
        if(user.role == "USUARIO"){
            user.role = "PREMIUM"
        }else{
            user.role = "USUARIO"
        }
        const userdto = new userDTO(user)
        return await userManager.updateUser(user._id, userdto);
    }

}