import { Router } from "express";
import { CartController } from '../controllers/CartController.js'
import { authMiddleware } from "../middleware/auth.middleware.js"
import "../middleware/passport.config.js";
import passport from "passport";

const cartController = new CartController()

const router = Router();

//funcion para crear un carrito
router.post('/', cartController.createCart)

//funcion para obtener los productos de un carrito
router.get('/:cid', cartController.getProductsByCart)

//funcion para agregar producto al carrito
router.post('/:cid/product/:pid',
                    passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/error", session: false }),
                    authMiddleware(["USUARIO"]),
                    cartController.addProductToCart)

//funcion para eliminar un producto del carrito
router.delete('/:cid/products/:pid', cartController.deleteProductToCart)

//funcion para actualizar carrito
router.put('/:cid', cartController.updateProductsCart)

//funcion actualizar cantidad de unidades de un producto del carrito
router.put('/:cid/products/:pid', cartController.updateQuantityProducts)

//vaciar el carrito
router.delete('/:cid', cartController.deleteAllProductsToCart)

//funcion para finalizar compra
router.post('/:cid/purchase', 
                    passport.authenticate("jwt", { failureRedirect: "http://localhost:8080/api/views/error", session: false }),
                    authMiddleware(["USUARIO"]),
                    cartController.purchase)


export default router;