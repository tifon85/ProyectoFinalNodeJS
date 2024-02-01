import { Router } from "express";
import { ProductController } from '../controllers/ProductController.js'

const productController = new ProductController()

const router = Router();

//crear producto
router.post('/', productController.CreateProduct)

//obtener todos los productos
router.get('/', productController.getProducts)

//obtener producto por id
router.get('/:pid', productController.getProductByID)

//actualizar producto
router.put('/:pid', productController.updateProduct)

//eliminar producto
router.delete('/:pid', productController.deleteProduct)

export default router;