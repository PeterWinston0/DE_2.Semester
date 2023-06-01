const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation');
//const { application } = require('express');

// /registration
router.post("/register", async (req, res) => {
  // Validate the user input (name, email, password)
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if the email is already registered
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  // Create a user object and save it in the database
  const userObject = new User({
    name: req.body.name,
    email: req.body.email,
    password
  });

  try {
    const savedUser = await userObject.save();
    res.json({
      error: null,
      data: {
        userId: savedUser._id,
        name: savedUser.name
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});


// /login
router.post("/login", async (req, res) => {
  // Validate user login info
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Fetch user data from MongoDB
  const user = await User.findOne({ email: req.body.email });

  // Throw error if email is wrong (user does not exist in DB)
  if (!user) {
    return res.status(400).json({ error: "Email or password is wrong" });
  }

  // Check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  // Throw error if password is wrong
  if (!validPassword) {
    return res.status(400).json({ error: "Email or password is wrong" });
  }

  // Create authentication token with user's id, email, and name
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.header("auth-token", token).json({
    error: null,
    data: {
      token,
      email: user.email,
    },
  });
});

module.exports = router;