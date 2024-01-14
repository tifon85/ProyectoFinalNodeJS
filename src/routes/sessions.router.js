import { Router } from "express";
import { UserManager } from '../Dao/managers/UsersManagerMongo.js'
import { generateToken } from "../utils.js";
import passport from "passport";
//import passport from "./config/passport.config.js";

const sessionRouter = Router();

const userManager = new UserManager()

// SIGNUP - LOGIN - PASSPORT LOCAL

sessionRouter.post('/register', 
                      passport.authenticate("register", {
                             successRedirect: "http://localhost:8080/api/views/login",
                             failureRedirect: "http://localhost:8080/api/views/error",
                             session: false, })
                        , async (req, res) => {
  try{
    res.status(200).json({ message: "Signed up" });
  } catch (error) {
    res.status(500).json({ error });
  }
})


sessionRouter.post('/login',
                      passport.authenticate("login", {
                             /*successRedirect: "http://localhost:8080/api/views/products",*/
                             failureRedirect: "http://localhost:8080/api/views/register",
                             session: false, })
                        , async (req, res) => {
  try{
    //jwt
    const cartID = req.user.cart._id
    const { first_name, last_name, role, email } = req.user;
    const token = generateToken({ first_name, last_name, email, role, cartID });
    res
      .status(200)
      .cookie("token", token, { maxAge: 1000000, httpOnly: true });
    res.redirect("http://localhost:8080/api/views/products");
  } catch (error) {
    res.status(500).json({ error });
  }
})
  
// SIGNUP - LOGIN - PASSPORT GITHUB

sessionRouter.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

//REVISAR DATOS DE LA COOKIE
sessionRouter.get("/callback",
                     passport.authenticate("github",{
                      /*successRedirect: "http://localhost:8080/api/views/products",
                      failureRedirect: "http://localhost:8080/api/views/error",
                     }*/
                     session: false, })
                     , async (req, res) => {
    try{
      //jwt
      const cartID = req.user.cart._id
      const { first_name, last_name, role, email } = req.user;
      const token = generateToken({ first_name, last_name, email, role, cartID });
      res
        .status(200)
        .cookie("token", token, { maxAge: 1000000, httpOnly: true });
      res.redirect("http://localhost:8080/api/views/products");
    } catch (error) {
      res.status(500).json({ error });
    }
  
});

// SIGNUP - LOGIN - PASSPORT GOOGLE
sessionRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

sessionRouter.get("/auth/google/callback",
                    passport.authenticate("google", { 
                      /*successRedirect: "http://localhost:8080/api/views/products",
                      failureRedirect: "http://localhost:8080/api/views/error",*/
                      session: false, })
                    , (req, res) => {
    try{
      //jwt
      const cartID = req.user.cart._id
      const { first_name, last_name, role, email } = req.user;
      const token = generateToken({ first_name, last_name, email, role, cartID });
      res
        .status(200)
        .cookie("token", token, { maxAge: 1000000, httpOnly: true });
      res.redirect("http://localhost:8080/api/views/products");
    } catch (error) {
      res.status(500).json({ error });
    }
});

sessionRouter.get("/logout", (req, res) => {
  res.clearCookie('token')
  res.redirect("http://localhost:8080/api/views/login");
});

sessionRouter.post("/restaurar", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      //no existe el usuario
      return res.redirect("http://localhost:8080/api/views/register");
    }
    const hashedPassword = await hashData(password);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

sessionRouter.get("/current", (req, res) => {
  res.render("currentSession", req.session.user);
});

export default sessionRouter