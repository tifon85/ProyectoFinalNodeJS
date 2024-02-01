import { ProductService } from "../services/ProductService.js";
import { CartService } from "../services/CartService.js";

const productService = new ProductService()
const cartService = new CartService()

export class CartController {

    //crear carrito
    createCart = async (req, res) => {
        try{
            const cartID = await cartService.createCartService()
            res.status(200).json({ message: "Carrito creado" }, cartID)
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
    
    //obtener los productos de un carrito
    getProductsByCart = async (req, res) => {
        const cid = req.params.cid
        try{
            const products = await cartService.getProductsByCartService(cid)
            res.status(200).json({ message: "Productos asociados al id de carrito indicado", products })
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    //agregar producto al carrito
    addProductToCart = async (req, res) => {
        const cid = req.params.cid
        const pid = req.params.pid
        try{
            const cart = await cartService.getCartByIDService(cid)
            const prod = await productService.getProductByIDService(pid)
            if(!prod){
                res.status(404).json({ message: "No existe el producto con el id indicado" });
            }else{
                if(!cart){
                    res.status(404).json({ message: "No existe el carrido con el id indicado" });
                }else{
                    await cartService.addProductToCartService(cart,pid)
                    res.status(200).render("detailProduct", { product: prod, user: req.user, message: "Producto agregado al carrito" })//json({ message: "Agregado el producto al carrito" });
                }
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    //eliminar un producto del carrito
    deleteProductToCart = async (req, res) => {
        const cid = req.params.cid
        const pid = req.params.pid
        try{
            const cart = await cartService.getCartByIDService(cid)
            if(!cart){
                res.status(404).json({ message: "No existe el carrito" })
            }else{
                const product = cartService.existProductInCartService(cart, pid)
                if(!product){
                    res.status(404).json({ message: "El producto no está en el carrito" })
                }else{
                    await deleteProductToCartService(cart,pid)
                    res.status(200).json({ message: "Producto eliminado del carrito", cart })
                }
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    //modifica los productos del carrito
    updateProductsCart = async (req,res) => {
        const cid = req.params.cid
        const products = req.body
        try{
            const cart = await cartService.getCartByIDService(cid)
            if(!cart){
                res.status(404).json({ message: "No existe el carrito" })
            }else{
                const existProducts = await productService.existProductsService(cart.products, exist=true)
                if(!existProducts){
                    res.status(404).json({ message: "No existe al menos un producto del carrito" })
                }else{
                    await cartService.updateProductsToCartService(cart, products)
                    res.status(200).json({ message: "Carrito actualizado", cart })
                }
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    //actualizar cantidad de unidades de un producto del carrito
    updateQuantityProducts = async (req,res) => {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity
        try{
            const cart = await cartService.getCartByIDService(cid)
            if(!cart){
                res.status(404).json({ message: "No existe el carrito" })
            }else{
                const productIndex = cartService.existProductInCartService(cart, pid)
                if (productIndex === -1) {
                    res.status(404).json({ message: "El producto no está en el carrito" })
                }else{
                    await cartService.updateQuantityProductsService(cart, quantity, productIndex)
                    res.status(200).json({ message: "Cantidad del producto actualizado en el carrito", cart })
                }
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    //eliminar todos los productos de un carrito
    deleteAllProductsToCart = async (req, res) => {
        const cid = req.params.cid
        try{
            const cart = await cartService.getCartByIDService(cid)
            if(!cart){
                res.status(404).json({ message: "No existe el carrito" })
            }else{
                await cartService.deleteAllProductsToCartService(cart)
                res.status(200).json({ message: "Carrito vacio", cart })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    purchase = async (req, res) => {
        const cid = req.params.cid
        const email = req.user.email
        try{
            await cartService.purchaseService(cid, email)
            res.status(200).json({ message: "Compra finalizada" })
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

}