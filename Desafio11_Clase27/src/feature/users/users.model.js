import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    default:null,
    
  },
});

export default mongoose.model("Users", UsersSchema);
