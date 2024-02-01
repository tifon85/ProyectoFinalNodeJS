import { MessageService } from "../services/MessageService.js";

const messageService = new MessageService()

export class MessageController {

    //crear Mensaje
    createMessage = async (req, res) => {
        const message = req.body
        try{
            await messageService.createMessageService(message)
            res.status(200).json({ message: "Carrito creado" })
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
    
    //Obtener todos los mensajes
    getMessages = async (req, res) => {
        try{
            const messages = await messageService.getMessagesService()
            res.status(200).json({ message: "Mensajes registrados", messages })
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

}