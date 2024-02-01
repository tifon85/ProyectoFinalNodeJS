import { CartManager } from "../Dao/CartManager.js";
import { TicketManager } from "../Dao/TicketManager.js";
import { ProductManager } from "../Dao/ProductManager.js";
import { ticketDTO } from "../Dao/DTOs/ticket.dto.js";
import { cartDTO } from "../Dao/DTOs/cart.dto.js";

const cartManager = new CartManager()
const ticketManager = new TicketManager()
const ProdManager = new ProductManager()

export class CartService {

    //crear carrito vacio
    createCartService = async () => {
        try{
            const cartid = await cartManager.createCart();
            return cartid
        }catch(error){
            throw new Error(error.message)
        }
    }

    //obtener todos los productos de un carrito indicado
    getProductsByCartService = async (idCart) => {
        try{
            const cart = await cartManager.getCartByID(idCart)
            const products = cart.products.map((p) => p.toObject())
            return products
        }catch(error){
            throw new Error(error.message)
        }
    }

    //agregar un producto al carrito
    addProductToCartService = async (cart, idProduct) => {
        try{
            const productIndex = cart.products.findIndex(prod => prod.product.equals(idProduct));
            if (productIndex === -1) {
                cart.products.push({ product: idProduct, quantity: 1 });
            } else {
                cart.products[productIndex].quantity++;
            }
            const cartdto = new cartDTO(cart)
            return await cartManager.updateCart(cart._id, cartdto)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //obtener carrito por id
    getCartByIDService = async (idCart) => {
        try{
            const cart = await cartManager.getCartByID(idCart)
            return cart
        }catch(error){
            throw new Error(error.message)
        }
    }

    //eliminar un producto del carrito
    deleteProductToCartService = async (cart, idProduct) => {
        try{
            cart.products = cart.products.filter(prod => prod.product._id!=idProduct)
            const cartdto = new cartDTO(cart)
            return await cartManager.updateCart(cart._id, cartdto)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //Actualiza los productos del carrito
    updateProductsCartService = async (cart, updatedProducts) => {
        try{
            cart.products = updatedProducts
            const cartdto = new cartDTO(cart)
            await cartManager.updateCart(cart._id, cartdto)
        }catch (error){
            throw new Error(error.message)
        }
    }

    //actualizar cantidad de unidades de un producto
    updateQuantityProductsService = async (cart, quantity) => {
        try{
            cart.products[productIndex].quantity=quantity
        }catch (error){
            throw new Error(error.message)
        }
    }

    //eliminar todos los productos de un carrito
    deleteAllProductsToCartService = async (cart) => {
        try{
            cart.products = []
            const cartdto = new cartDTO(cart)
            return await cartManager.updateCart(cart._id, cartdto)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //verifica si producto está en el carrito
    existProductInCartService = async (cart, idProduct) => {
        try{
            const productIndex = cart.products.findIndex(prod => prod.product.equals(idProduct))
            return productIndex
        }catch(error){
            throw new Error(error.message)
        }
    }

    purchaseService = async (idCart, email) => {
        // suficiente stock => restarlo del stock *
        // stock insuficiente => no agregar el prod a la compra final
        // generar un ticket
        // devolver arreglo prod si compra no exitosa
        // carrito debe tener al final solo productos que no se compraron
        const cart = await cartManager.getCartByID(idCart);
        const products = cart.products;
        let availableProducts = [];
        let unavailableProducts = [];
        let totalAmount = 0;
        for (let item of products) {
          if (item.product.stock >= item.quantity) {
            // disponible
            availableProducts.push(item);
            item.product.stock -= item.quantity;
            await ProdManager.updateProduct(item.product._id, item.product);
            totalAmount += item.quantity * item.product.price;
          } else {
            //no disponible
            unavailableProducts.push(item);
          }
        }
      
        cart.products = unavailableProducts;
        const cartdto = new cartDTO(cart)
        await cartManager.updateCart(cart._id, cartdto);
        if (availableProducts.length) {
            const ticketdto = new ticketDTO({totalAmount, email})
            return await ticketManager.createTicket(ticketdto);
        }
        return {unavailableProducts}
      };

}