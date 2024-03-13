import { Router } from "express";
import passport from "passport";
import { UserController } from "../controllers/UserController.js"

const userController = new UserController()

const sessionRouter = Router();

// SIGNUP - LOGIN - PASSPORT LOCAL

sessionRouter.post('/register', 
                      passport.authenticate("register", {
                             successRedirect: "http://localhost:8080/api/views/login",
                             failureRedirect: "http://localhost:8080/api/views/error",
                             session: false, })
                        , userController.registerUser)


sessionRouter.post('/login',
                      passport.authenticate("login", {
                             /*successRedirect: "http://localhost:8080/api/views/products",*/
                             failureRedirect: "http://localhost:8080/api/views/register",
                             session: false, })
                        , userController.loginUser)
  
// SIGNUP - LOGIN - PASSPORT GITHUB

sessionRouter.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

//REVISAR DATOS DE LA COOKIE
sessionRouter.get("/callback",
                     passport.authenticate("github",{
                      /*successRedirect: "http://localhost:8080/api/views/products",*/
                      failureRedirect: "http://localhost:8080/api/views/register",
                     session: false, })
                     , userController.loginUser);

// SIGNUP - LOGIN - PASSPORT GOOGLE
sessionRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

sessionRouter.get("/auth/google/callback",
                    passport.authenticate("google", { 
                      /*successRedirect: "http://localhost:8080/api/views/products",*/
                      failureRedirect: "http://localhost:8080/api/views/register",
                      session: false, })
                    , userController.loginUser);

sessionRouter.get("/logout", userController.logoutUser);

sessionRouter.post("/forgotPassword", userController.forgotPassword);

sessionRouter.post("/restaurar", userController.restaurarPassword);

sessionRouter.get("/current", userController.currentSession);

export default sessionRouter