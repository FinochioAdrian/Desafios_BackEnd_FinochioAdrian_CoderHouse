import { boolean } from 'joi';
import mongoose from 'mongoose'

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: string,
  description: string,
  code: string,
  price: number,
  status: boolean,
  stock: number,
  category: string,
  thumbnails: array.items(string),
})

export const productModel = mongoose.model(productCollection,productSchema)