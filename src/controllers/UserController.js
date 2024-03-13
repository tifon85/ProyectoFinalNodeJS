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
            console.log(req.user)
            //jwt
            const token = await userService.loginUserService(req.user)
            console.log(token)
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
                return res.redirect("http://localhost:8080/api/views/register");
            }
            await userService.forgotPassword(email)
            res.status(200).json({ message: "Mail para reestablecer password enviado" });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //restaurar password
    restaurarPassword = async (req, res) => {
        const { password1, password2 } = req.body;
        const email = req.email
        try {
            if(password1 != password2){
                res.status(400).json({ message: "No coinciden las passwords" });
            }
            const user = await userService.getUserByEmailService(email)
            if (!user) {
                //no existe el usuario
                return res.redirect("http://localhost:8080/api/views/register");
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
        res.clearCookie('token')
        res.redirect("http://localhost:8080/api/views/login");
    }

    updateRoleUser = async (req, res) => {
        const user = req.user
        try {
            if(user.role != "ADMIN"){
                await userService.updateRole(user)
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }

}