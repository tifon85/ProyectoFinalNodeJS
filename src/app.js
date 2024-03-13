import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/sessions.router.js'
import usersRouter from './routes/users.router.js'
import { __dirname } from './utils/utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductService } from './services/ProductService.js'
import { MessageService } from './services/MessageService.js'
import { CartService } from './services/CartService.js'
import { URI } from "./db/configDB.js"
import cookieParser from "cookie-parser";
import "./middleware/passport.config.js";
import { port } from "./config/dotenv.config.js"
import cors from "cors"
import errorHandler from "./middleware/errors.js";
import { addLogger } from './utils/logger.js';

const app = express()
//const port = 8080

//Cors para configurar los origenes desde los que aceptamos los request
app.use(cors())

app.use(cookieParser())

// passport
/*app.use(passport.initialize());*/

app.use(errorHandler)
app.use(addLogger);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

// handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/messages',messagesRouter)
app.use('/api/sessions',sessionsRouter)
app.use('/api/views',viewsRouter)
app.use('/api/users',usersRouter)

const httpServer = app.listen(port,(error)=>{
    if(error) console.log(error)
    console.log("Servidor escuchando en el puerto: ", port)
})

const socketServer = new Server(httpServer)

const productService = new ProductService()
const messageService = new MessageService()
const cartService = new CartService()

//socket productos
socketServer.on("connection", async (socket) => {

    const products = await productService.getProductsService({})
    const messages = await messageService.getMessagesService()

    //socket productos
    socketServer.emit("products", products);
    socketServer.emit("chat", messages);

    socket.on("CreateProduct", async (value) => {
        await productService.CreateProductService(value)
        const products = await productService.getProductsService({})
        socketServer.emit("products", products);
    });
    socket.on("deleteId", async (value) => {
        await productService.deleteProductService(value)
        const products = await productService.getProductsService({})
        socketServer.emit("products", products);
    });

    socket.on("message", async (infoMessage) => {
        await messageService.createMessageService(infoMessage)
        const messages = await messageService.getMessagesService()
        socketServer.emit("chat", messages);
    });

    socket.on("addProduct", async (infoProduct) => {
        const cart = await cartService.getCartByIDService(infoProduct.cartID)
        await cartService.addProductToCartService(cart, infoProduct.productID)
    });

  });