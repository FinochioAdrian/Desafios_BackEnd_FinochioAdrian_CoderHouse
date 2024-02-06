import { boolean } from 'joi';
import mongoose from 'mongoose'

const cartCollection = "carts";
//! Falta terminar
const cartSchema = mongoose.Schema({
  products: array()
  .items(
    object({
      id: string().required(),
      quantity: number().integer().strict(true).required(),
    })
  )
  .required(),


})

