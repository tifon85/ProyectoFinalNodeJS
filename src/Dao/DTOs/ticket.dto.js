import { v4 as uuidv4 } from "uuid";

export class ticketDTO{

    constructor(ticket){
        this.code=uuidv4(),
        this.purchase_datetime=new Date(),
        this.amount=ticket.totalAmount,
        this.purchaser=ticket.email
    }

}