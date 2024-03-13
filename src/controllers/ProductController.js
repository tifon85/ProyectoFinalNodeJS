import { ProductService } from "../services/ProductService.js";
import CustomError from "../services/errors/CustomError.js";
import generateUserErrorInfo from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";

const productService = new ProductService()

export class ProductController {

    //crear producto
    CreateProduct = async (req, res) => {
        const product = req.body
        const {title, description, price, category, code, stock} = req.body
        try{
            //VALIDACIONES
            if(!title || !description || !price || !category || !code || !stock){
                CustomError.createError({
                    name: 'User Creation Error',
                    cause: generateUserErrorInfo({ title, description, price, category, code, stock }),
                    message: 'Error trying to create user',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            const yaEsta = await productService.existProductCodeService(code)
            if(yaEsta.length == 0){
                await productService.CreateProductService(product)
                res.status(200).json({ message: "Producto agregado" })
            }else{
                res.status(404).json({ message: "Ya existe un producto registrado con ese codigo" })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
    
    //obtener todos los productos
    getProducts = async (req, res) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        let query = req.query.query
        const sort = req.query.sort

        const params = { page, limit, query, sort }

        try{
            const products = await productService.getProductsService(params)
            res.status(200).json({ message: "Products", products })
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    //obtener un producto indicado por ID
    getProductByID = async (req, res) => {
        const pid = req.params.pid
        try{
            const product = await productService.getProductByIDService(pid)
            if(!product){
                res.status(404).json({ message: "Producto no encontrado con el id de producto indicado" })
            }else{
                res.status(200).json({ message: "Producto encontrado", product })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
    
    //actualizar producto indicado por ID
    updateProduct = async (req, res) => {
        const pid = req.params.pid
        const updatedProduct = req.body
        try{
            const currentProduct = await productService.getProductByIDService(pid)
            if(!product){
                res.status(404).json({ message: "No se encontró el producto a actualizar" })
            }else{
                await productService.updateProductService(currentProduct, updatedProduct)
                res.status(200).json({ message: "Producto actualizado" })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
    
    //eliminar producto indicado por ID
    deleteProduct = async (req, res) => {
        const pid = req.params.pid
        try{
            const product = await productService.getProductByIDService(pid)
            if(!product){
                res.status(404).json({ message: "Producto no encontrado con el id de producto indicado" })
            }else{
                await productService.deleteProductService(pid)
                res.status(200).json({ message: "Producto eliminado" })
            }
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
}