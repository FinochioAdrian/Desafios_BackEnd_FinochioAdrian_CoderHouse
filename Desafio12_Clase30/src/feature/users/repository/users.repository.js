
export default class UsersRepository {

    constructor (dao){
        this.dao= dao
    }
    
    getUserByEmail = async  (email) =>{
        const result = await this.dao.getUserByEmail(email)
        return result
    }
    getUserByCreds = async  (email, password) =>{
        const result = await this.dao.getUserByCreds(email, password)
        return result
    }
    insert = async  (userData) =>{
        const result = await this.dao.insert(userData)
        return result
    }
    getUserByID = async  (id) =>{
        const result = await this.dao.getUserByID(id)
        return result
    }
    newPassword = async  (user) =>{
        const result = await this.dao.newPassword(user)
        return result
    }
      
}