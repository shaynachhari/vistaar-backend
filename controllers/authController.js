const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error during registration:", error);
    res.status(400).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {userId: user.userId, role: user.role ,name: user.name},
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.googleAuth = async (req, res) => {
  console.log("coming in controller google body: ", req.body);
  
  try {
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googleRes = ticket.getPayload();
    console.log("User Data:", googleRes);
    let user = await User.findOne({ email: googleRes.email })
    console.log("user: ", user);
    
    if (!user) {
      console.log("User not found:", googleRes.email);
      user = new User({  name: googleRes.name,  email: googleRes.email,  role: "user",  googleId: googleRes.sub,
        userId: uuidv4(),
      });
      await user.save();
    }
    const jwtToken = jwt.sign(
      { userId: user.userId, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Login successful", token: jwtToken });
  } catch (error) {
    console.log("Google OAuth Error:", error);
    res.status(500).json({ error: "Google OAuth failed" });
  }
};