import { Router } from "express";
import { MessageController } from '../controllers/MessageController.js'
//import { transporter } from "../utils/nodemailer.js";

const messageController = new MessageController()

const router = Router();

//crear mensajes
router.post('/', messageController.createMessage)

//obtener mensajes
router.get('/', messageController.getMessages)

//Envio de mail bienvenida
/*router.post("/", async (req, res) => {
    const { first_name, last_name, email, message } = req.body;
    const mailOptions = {
      from: "FaridCoder",
      to: email,
      subject: `Bienvenido ${first_name} ${last_name}`,
      text: message,
    };
    await transporter.sendMail(mailOptions);
    res.send("Email enviado");
  });*/

export default router;