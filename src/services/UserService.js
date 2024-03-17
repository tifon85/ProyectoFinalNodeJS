import { UserManager } from "../Dao/UserManager.js";
import { userDTO } from "../Dao/DTOs/user.dto.js";
import { hashData, compareData, generateToken } from "../utils/utils.js";
import { transporter } from "../utils/nodemailer.js";
import { v4 as uuidv4 } from "uuid";

const userManager = new UserManager()

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

    forgotPassword = async (user) => {
        
        try{
            const clave = uuidv4()
            user.resetToken = clave
            user.ExpireresetToken_datetime = new Date()
            const userdto = new userDTO(user)
            await userManager.updateUser(user._id, userdto);
            //Envio de mail para recuperar password
            const mailOptions = {
                from: "nico.ten85@gmail.com",
                to: user.email,
                subject: `Recupero de contraseña`,
                text: `<div>
                <h1>Ingresa al siguiente link para actualizar tu password</h1>
                http://localhost:8080/api/views/restaurarPassword/${clave}
                </div>`,
            };
            await transporter.sendMail(mailOptions);
        }catch(error){
            throw new Error(error.message)
        }

    }

    restaurarPasswordService = async (password, user) => {
        try{
            user.password = await hashData(password);
            const userdto = new userDTO(user)
            return await userManager.updateUser(user._id, userdto);
        }catch(error){
            throw new Error(error.message)
        }
        
    }

    loginUserService = async (user) => {
        const cartID = user.cart._id
        const { first_name, last_name, role, email } = user;
        const token = generateToken({ first_name, last_name, email, role, cartID });
        user.last_connection = new Date()
        const userdto = new userDTO(user)
        await userManager.updateUser(user._id, userdto);
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

    verificarToken = async (resetToken) => {
        let user = await userManager.getUserByToken(resetToken)
        if(user.resetToken != resetToken || (new Date()-user.ExpireresetToken_datetime) > 3600000 /*una hora en milisegundos*/){
            //si el token no es correcto o pasó mas de una hora, el token NO es valido
            return 'undefined';
        }
        //si no pasa lo indicado antes, entonces ES valido
        return user;
    }

}