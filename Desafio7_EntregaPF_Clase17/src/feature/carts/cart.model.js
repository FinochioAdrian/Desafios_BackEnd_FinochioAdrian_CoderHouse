import mongoose, { Schema } from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    required: true,
  },
});
export default mongoose.model(cartCollection, cartSchema);
