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

    //restaurar password
    restaurarPassword = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await userService.getUserByEmailService(email)
            if (!user) {
                //no existe el usuario
                return res.redirect("http://localhost:8080/api/views/register");
            }
            await userService.restaurarPasswordService(password, user)
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

}