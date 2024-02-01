import { MessageManager } from "../Dao/MessageManager.js";
import { messageDTO } from "../Dao/DTOs/message.dto.js";

const messageManager = new MessageManager()

export class MessageService {

    //Guardar mensaje
    createMessageService = async (message) => {
        try {
            const messagedto = new messageDTO(message)
            await messageManager.createMessage(messagedto)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //Obtener todos los mensajes
    getMessagesService = async () => {
        try{
            const messages = await messageManager.getMessages()
            return messages
        }catch(error){
            throw new Error(error.message)
        }
    }

}