import Tickets from "./tickets.model.js"

export default class TicketDao {
    constructor() {

    }
    get = async () =>{
        try {
            
        } catch (error) {
            console.log("❌ ~ TicketDao ~ get= ~ error:", error)
            throw error;
            
        }
    }
    create= async(ticketDao)=>{
        try {
            const newTicket= await new Tickets(ticketDao).save();
            return newTicket
        } catch (error) {
            console.log("❌ ~ TicketDao ~ create= ~ error:", error)
            throw error;
        }
    }
}