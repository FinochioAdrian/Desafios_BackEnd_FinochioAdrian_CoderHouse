

export default class MessagesRepository{
    constructor(dao){
        this.dao=dao
    }

        getAll= async() =>{
            const result = await this.dao.getAll()
            return result
        }
        getById= async(id) =>{
            const result = await this.dao.getById(id)
            return result
        }
        add= async(userMail, message) =>{
            const result = await this.dao.add(userMail, message)
            return result
        }
        addNewMessageByUserMail= async(userMail, message) =>{
            const result = await this.dao.addNewMessageByUserMail(userMail, message)
            return result
        }
        update= async(id, message) =>{
            const result = await this.dao.update(id, message)
            return result
        }
        remove= async(id) =>{
            const result = await this.dao.remove(id)
            return result
        }
        removeByUser= async(userMail) =>{
            const result = await this.dao.removeByUser(userMail)
            return result
        }
}