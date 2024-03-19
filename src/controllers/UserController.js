import { UserService } from "../services/UserService.js";

const userService = new UserService()

export class UserController {

    //registrar usuario
    registerUser = async (req, res) => {
        try{
            res.status(200).json({ message: "Signed up" });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //login, callback github y google
    loginUser = async (req, res) => {
        try{
            //jwt
            const token = await userService.loginUserService(req.user)
            res
            .status(200)
            .cookie("token", token, { maxAge: 1000000, httpOnly: true });
            res.redirect("http://localhost:8080/api/views/products");
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    forgotPassword = async (req, res) => {
        const { email } = req.body;
        try{
            const user = await userService.getUserByEmailService(email)
            if (!user) {
                //no existe el usuario
                res.status(400).json({ message: "No existe usuario registrado con el email ingresado" });
            }
            await userService.forgotPassword(user)
            res.status(200).json({ message: "Mail para reestablecer password enviado" });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //restaurar password
    restaurarPassword = async (req, res) => {
        const { password1, password2, tokenReset } = req.body;
        try {
            const user = await userService.verificarToken(tokenReset)
            if(!user){
                res
                .status(400)
                .json({ message: "Token vencido, realice el proceso de envío de mail para restablecer contraseña nuevamente" })
                .redirect("http://localhost:8080/api/views/register");
            }
            if(password1 != password2){
                res.status(400).json({ message: "No coinciden las passwords" });
            }
            const isPasswordValid = await userService.isPasswordValidService(password1, user.password)
            if(isPasswordValid){
                res.status(400).json({ message: "La password no puede ser la misma que la anterior"})
            }
            await userService.restaurarPasswordService(password1, user)
            res.status(200).json({ message: "Password updated" });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    currentSession = async (req, res) => {
        res.render("currentSession", req.session.user);
    }

    logoutUser = async (req, res) => {
        console.log(req.session.user)
        await userService.updateLastConnection()
        res.clearCookie('token')
        res.redirect("http://localhost:8080/api/views/login");
    }

    updateRoleUser = async (req, res) => {
        const uid = req.params.uid
        try {
            const user = await userService.getUserByIdService(uid)
            if(user.role != "ADMIN"){
                if(!userService.checkDocuments(user.documents) && user.role=="USUARIO"){
                    res.status(400).json({ message: "El usuario NO cuenta con la documentación necesaria"})
                }
                await userService.updateRole(user)
                res.status(200).json({ message: "Role actualizado" });
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    saveUserDocuments = async (req, res) => {
        try{
            const { uid } = req.params.uid;
            console.log(req.files);
            const { name, reference } = req.files;
            const response = await userService.saveUserDocumentsService({ uid, name, reference });
            res.json({ response });
        } catch (error) {
            res.status(500).json({ error });
        }
    };

    getUsers = async (req, res) => {
        try{
            const users = await userService.getUsersService()
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    deleteUsers = async (req, res) => {
        try{
            await userService.deleteUsersService()
            res.status(200).json({ message: "Ya se encuentran eliminados los usuarios que no se hayan conectado en los ultimos 2 dias" });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

}