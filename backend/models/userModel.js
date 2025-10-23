import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: { type: Object, default: {} },
  role: { type: String, default: "user" }
});

export default mongoose.model("User", userSchema);
