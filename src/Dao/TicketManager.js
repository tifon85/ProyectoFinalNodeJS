import { ticketsModel } from "../db/models/tickets.model.js";

export class TicketManager {
  createTicket = async (ticket) => {
    const response = await ticketsModel.create(ticket);
    return response;
  }
}