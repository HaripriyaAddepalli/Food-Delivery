import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String
});

export default mongoose.model("Food", foodSchema);
