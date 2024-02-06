import mongoose from "mongoose";

const chatCollection = "chats"

const chatSchema = mongoose.Schema({
    user:mail,
    message: string
})

export const chatModel = mongoose.model(chatCollection,chatSchema)