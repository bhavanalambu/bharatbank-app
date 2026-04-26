import express from "express";

const router = express.Router();

// Demo Admin
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@bharatbank.in" && password === "admin123") {
    return res.json({
      _id: "1",
      email,
      role: "admin"
    });
  }

 
  if (email === "arjun@bharatbank.in" && password === "password123") {
    return res.json({
      _id: "2",
      email,
      role: "user"
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

router.post("/register", (req, res) => {
  res.json({ message: "User registered" });
});

export default router;