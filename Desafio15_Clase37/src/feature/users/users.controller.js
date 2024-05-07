import { usersService as Users } from "./repository/users.service.js";

async function switchUserRole(req, res, next) {
    try {
        const { uid } = req.params
        const user = await Users.getUserByID("6615ddc6d1ee721a109aaa27")
        user.role = user.role == "user" ? "premium" : "user"
        
        const savedUser = await Users.update(user)
        return res.send({ result: "succes", newRole: savedUser.role })
    } catch (error) {
        next(error)
    }
}

export { switchUserRole }