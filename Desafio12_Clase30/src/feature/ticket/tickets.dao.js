import ticketsModel from "./tickets.model"

export default class TicketDao {
    constructor() {

    }
    get=async () =>{

    }
    create= async(ticketdao)=>{
        const result = ticketsModel.add(ticketdao)
    }
}