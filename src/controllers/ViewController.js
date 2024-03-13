import { ProductService } from "../services/ProductService.js";
import { CartService }  from "../services/CartService.js";

const productService = new ProductService()
const cartService = new CartService()

export class ViewController {

    InitPage = async (req, res) => {
        res.redirect("http://localhost:8080/api/views/login");
    }

    viewRegister = async (req, res) => {
        if (req.user) {
            return res.redirect("http://localhost:8080/api/views/products");
        }
        res.render("register");
    }

    viewLogin = async (req, res) => {
        if (req.user) {
            return res.redirect("http://localhost:8080/api/views/products");
        }
        res.render("login");
    }

    viewProfile = async (req, res) => {
        if (!req.user) {
            return res.redirect("http://localhost:8080/api/views/login");
        }
        res.render("profile", { user: req.user });
    }

    viewForgotPassword = async (req,res) => {
        res.render("forgotPassword");
    }

    viewrestaurarPassword = async (req, res) => {
        res.render("restaurar");
    }

    viewError = async (req, res) => {
        res.render("error");
    }

    viewProducts = async (req, res) => {
        try{
            let products = await productService.getProductsService({})
            res.render("products", { products , user: req.user })
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    viewDetailProduct = async (req, res) => {
        if (!req.user) {
            return res.redirect("http://localhost:8080/api/views/login");
        }
        const pid = req.params.pid
        try{
            const product = await productService.getProductByIDService(pid)
            if(!product){
                res.status(404).json({ message: "Producto no encontrado" })
            }else{
                res.render("detailProduct", { product , user: req.user })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    viewCartProducts = async (req, res) => {
        if (!req.user) {
            return res.redirect("http://localhost:8080/api/views/login")
        }
    
        const cid = req.params.cid
        try{
            const products = await cartService.getProductsByCartService(cid)
            if(!products){
                res.status(404).json({ message: "No existe el carrito" })
            }else{
                res.render("cart", { products, user: req.user })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    viewChat = async (req, res) => {
        res.render("chat", { user: req.user });
    }

    viewRealtimeproducts = async (req, res) => {
        res.render("realTimeProducts", { user: req.user })
    }

}