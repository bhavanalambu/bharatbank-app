import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  type: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);