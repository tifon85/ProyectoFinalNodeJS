import { ProductManager } from "../Dao/ProductManager.js";
import { productDTO } from "../Dao/DTOs/product.dto.js";

const prodManager = new ProductManager()

export class ProductService {

    //agregar un producto a los ya existentes
    CreateProductService = async (product) => {
        try {
            const productdto = new productDTO(product)
            await prodManager.addProduct(productdto)
        }catch(error){
            throw new Error(error.message)
        }
    }
    
    //obtener todos los productos
    getProductsService = async (query) => {
        try{
            const products = await prodManager.getProducts(query)
            return products;
        }catch(error){
            throw new Error(error.message) 
        }
    }

    //obtener un producto indicado por ID
    getProductByIDService = async (idProduct) => {
        try{
            const product = await prodManager.getProductByID(idProduct)
            return product
        }catch(error){
            throw new Error(error.message)
        }
    }

    //verifica si existe producto con el codigo a registrar
    existProductCodeService = async (code) => {
        try{
            const product = await prodManager.existProductCode(code)
            return product
        }catch(error){
            throw new Error(error.message)
        }
    }

    //actualizar producto indicado por ID
    updateProductService = async (currentProduct, updatedProduct) => {
        try{
            currentProduct.title = updatedProduct.title || currentProduct.title
            currentProduct.description = updatedProduct.description || currentProduct.description
            currentProduct.price = updatedProduct.price || currentProduct.price
            currentProduct.code = updatedProduct.code || currentProduct.code
            currentProduct.stock = updatedProduct.stock || currentProduct.stock
            currentProduct.category = updatedProduct.category || currentProduct.category
            currentProduct.thumbnails = updatedProduct.thumbnails || currentProduct.thumbnails
            currentProduct.status = updatedProduct.status || currentProduct.status
            const productdto = new productDTO(currentProduct)
            await prodManager.updateProduct(currentProduct._id, productdto);
        }catch (error){
            throw new Error(error.message)
        }
    }

    //eliminar producto indicado por ID
    deleteProductService = async (idProduct) => {
        try{
            await prodManager.deleteProduct(idProduct)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //verificar que todos los productos cargados al carrito existan
    existProductsService = async (Products, exist) => {

        for(const i=0; i < Products.length && exist == true; i++){
            let product = await prodManager.getProductByID(Products[i]._id)
            if(!product){
                exist = false
            }else{
                exist = true
            }
        }
        return exist
    }

}