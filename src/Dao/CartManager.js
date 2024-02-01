import { cartsModel } from "../db/models/carts.model.js";

export class CartManager{

    //funcion para crear el carrito vacio
    createCart = async () => {
        try{
            const newCart = { products: [] };
            const cart = await cartsModel.create(newCart);
            return cart._id.toString()
        }catch(error){
            throw new Error(error.message)
        }
    }

    //Actualizar carrito
    updateCart = async (idCart, cart) => {
        return cartsModel.updateOne({ _id: idCart }, cart);
    }

    //funcion para traer carrito por id
    getCartByID = async (idCart) => {
        try{
            const cart = await cartsModel.findById(idCart).populate("products.product")
            return cart
        }catch(error){
            throw new Error(error.message)
        }
    }
    
}