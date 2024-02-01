import { Router } from "express";
import { MessageController } from '../controllers/MessageController.js'

const messageController = new MessageController()

const router = Router();

//crear mensajes
router.post('/', messageController.createMessage)

//obtener mensajes
router.get('/', messageController.getMessages)

export default router;