import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: "Pending" }
});

export default mongoose.model("Order", orderSchema);
