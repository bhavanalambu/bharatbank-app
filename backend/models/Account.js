import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  balance: { type: Number, default: 0 }
});

export default mongoose.model("Account", accountSchema);