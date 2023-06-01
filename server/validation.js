const joi = require("joi");
const jwt = require("jsonwebtoken");

// validating registration
const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).max(255).required(),
    email: joi.string().min(6).max(255).required(),
    password: joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

// validating login
const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).max(255).required(),
    password: joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

//logic to verify out token (JWT)
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: "Token is not valid" });
  }
};

module.exports = { registerValidation, loginValidation, verifyToken };
