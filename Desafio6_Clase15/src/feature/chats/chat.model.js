import mongoose, { Schema } from "mongoose";

const chatCollection = "chats"

const chatSchema = mongoose.Schema({
    user: {
      type: String,
      validate: {
        validator: (value) => {
          
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: `${VALUE} no es un formato de correo electrónico válido.`,
      },
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  });
  
  export default mongoose.model(chatCollection, chatSchema);
  