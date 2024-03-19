import { UsersModel } from "../db/models/users.model.js"

export class UserManager{

    //funcion para crear el carrito vacio
    createUser = async (datosUser) => {
        try{
            const response = await UsersModel.create(datosUser);
            return response;
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por email
    getUserByEmail = async (email) => {
        try{
            const user = await UsersModel.findOne({ email })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por id
    getUserById = async (id) => {
        try{
            const user = await UsersModel.findOne({ _id: id })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    //Actualizar carrito
    updateUser = async (idUser, user) => {
        return UsersModel.updateOne({ _id: idUser }, user);
    }

    //funcion para traer carrito por token
    getUserByToken = async (resetToken) => {
        try{
            const user = await UsersModel.findOne({ resetToken })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    getUsers = async (values) => {
        try{
            const users = await UsersModel.find(values, 'first_name email role')
            return users
        }catch(error){
            throw new Error(error.message)
        }
    }

    deleteUsers = async (values) => {
        try{
            
            // Eliminar los usuarios que no se han conectado en los últimos 2 días
            await UsersModel.deleteMany(values);

        }catch(error){
            throw new Error(error.message)
        }
    }

}