// server/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  password: String, // stored as hash
});

export default mongoose.model("User", userSchema);
