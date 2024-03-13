import { Router } from "express"
import "../middleware/passport.config.js";
import passport from "passport";
import { ViewController } from '../controllers/ViewController.js'
import { authMiddleware } from "../middleware/auth.middleware.js"

const viewController = new ViewController()

const router = Router()

router.get('/', viewController.InitPage)

router.get('/register', viewController.viewRegister)

router.get('/login', viewController.viewLogin)

router.get("/profile", viewController.viewProfile);

router.get("/forgot-password", viewController.viewForgotPassword);

router.get("/restaurar",
                passport.authenticate("jwtPassword", { failureRedirect: "http://localhost:8080/api/views/forgot-password", session: false }),
                viewController.viewRestaurar);
  
router.get("/error", viewController.viewError);

router.get('/products',
                passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/login", session: false }),
                viewController.viewProducts)

router.get('/detailProduct/:pid',
                passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/login", session: false }),
                viewController.viewDetailProduct)

//funcion para mostrar los productos de un carrito
router.get('/cart/:cid',
                passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/login", session: false }),
                viewController.viewCartProducts)

//funcion para mostrar productos en tiempo real
router.get('/realtimeproducts',
                passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/login", session: false }),
                authMiddleware(["ADMIN","PREMIUM"]),
                viewController.viewRealtimeproducts)

//funcion para mostrar chat en tiempo real
router.get("/chat",
                passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/login", session: false }),
                authMiddleware(["USUARIO"]),
                viewController.viewChat);

export default router