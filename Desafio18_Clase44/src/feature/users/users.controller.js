import { usersService as Users } from "./repository/users.service.js";

async function switchUserRole(req, res, next) {
    try {
        const { uid } = req.params
        const user = await Users.getUserByID(uid)
         user.role = user.role == "user" ? "premium" : "user"
        
        const savedUser = await Users.update(user)
        return res.send({ result: "succes", newRole: savedUser.role })
    } catch (error) {
        next(error)
    }
}

async function getAll (req, res, next) {
    try {
        const users = await Users.getAllUsers()
        return res.send({ result: "succes", newRole: savedUser.role })
    } catch (error) {
        next(error)
    }
}
async function getUser (req, res, next) {
    try {
        const {uid:id} = req.params
        if(!id) {
            return res.send(400).send({result:fail,msg:`uid params is requiered`})
        }

        const user= await Users.getUserByID(id)
        if (!user){
            return res.send({ result: "fail", msg: "User no found" })
        }
        return res.send({ result: "succes", user })
    } catch (error) {
        next(error)
    }
}

export { switchUserRole,getAll, getUser}