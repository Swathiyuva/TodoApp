import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String, // ✅ Add this line
  email: String,
  password: String,
});

export default mongoose.model("User", userSchema);
