import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json(user);
};