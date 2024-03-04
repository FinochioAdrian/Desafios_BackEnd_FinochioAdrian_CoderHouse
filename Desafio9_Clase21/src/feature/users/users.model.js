import mongoose from "mongoose";
// ! Falta agregar roles
const UsersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"], 
        default: "user"
    }
});

export default mongoose.model("Users", UsersSchema);