const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Updated to use your Brevo SDK configuration
const { sendEmail } = require("../config/nodemailer"); 

/* ===========================
    REGISTER (SEND CODE)
=========================== */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists." });
    }

    // 3. Clear any previous unused codes for this email
    await VerificationCode.deleteMany({ email, used: false });

    // 4. Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Store code in DB with 10-minute expiry
    await VerificationCode.create({
      email,
      DBcode: code,
      used: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // 6. Prepare Professional HTML Email
    const htmlContent = I understand. You want the code clean, the "Building Digital Excellence" branding front and center, and you want to remove the blue gradient line from the background to keep the design sleek and professional.

I have also ensured that process.env.JWT_SECRET is used correctly without hardcoding any secrets.

JavaScript
const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const HomeHero = require("../models/HomeHero");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/nodemailer");

/* ===========================
    REGISTER (SEND CODE)
=========================== */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists." });
    }

    // Dynamic Title & Image from your Hero model
    const heroData = await HomeHero.findOne().sort({ createdAt: -1 });
    const displayLogo = heroData && heroData.image ? heroData.image : "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770377714/home_hero/i6vhbionblsgudwkywqb.jpg";

    // DROP Logic: Clear previous codes for this email
    await VerificationCode.deleteMany({ email, used: false });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.create({
      email,
      DBcode: code,
      used: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media screen and (max-width: 480px) {
          .card { width: 100% !important; border-radius: 0 !important; }
          .otp { font-size: 28px !important; letter-spacing: 4px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Segoe UI', Arial, sans-serif;">
      <center style="width: 100%; background-color: #ffffff; padding: 40px 0;">
        <div class="card" style="max-width: 600px; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden;">
          
          <div style="padding: 40px 20px; text-align: center;">
            <img src="${displayLogo}" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;" />
            <h1 style="color: #111111; font-size: 24px; font-weight: 800; margin-top: 20px;">Building Digital Excellence</h1>
          </div>

          <div style="padding: 0 40px 40px 40px; text-align: center;">
            <p style="font-size: 16px; color: #444444;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 15px; color: #666666; line-height: 1.6;">Use the verification code below to secure your account:</p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 8px; display: inline-block;">
              <span class="otp" style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #000000;">${code}</span>
            </div>
            
            <p style="font-size: 13px; color: #aaaaaa; margin-top: 20px;">
              This code expires in 10 minutes.
            </p>
          </div>

          <div style="background-color: #fafafa; padding: 20px; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="font-size: 12px; color: #999999; margin: 0;">&copy; ${new Date().getFullYear()} Building Digital Excellence</p>
          </div>
        </div>
      </center>
    </body>
    </html>
    `;

    // 7. Send via Brevo API
    await sendEmail(
        email, 
        "Welcome to my Portfolio - Your Verification Code", 
        htmlContent
    );

    res.json({ msg: "Verification code sent to your email." });

  } catch (err) {
    console.error("❌ Registration/Brevo Error:", err);
    res.status(500).json({ msg: "Server error during registration. Check Brevo API Key." });
  }
};

/* ===========================
    VERIFY CODE & CREATE USER
=========================== */
exports.verify = async (req, res) => {
  try {
    const { code, email, name, password } = req.body;

    if (!code || !email || !name || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // 1. Find the matching code record
    const record = await VerificationCode.findOne({
      email,
      DBcode: code,
      used: false,
    });

    if (!record) {
      return res.status(400).json({ msg: "Invalid or already used code." });
    }

    // 2. Check for expiry
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Verification code expired." });
    }

    // 3. Prevent duplicate creation if they refreshed the page
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already registered." });
    }

    // 4. Mark code as used
    record.used = true;
    await record.save();

    // 5. Hash password and Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    // 6. Generate JWT for instant login after verification
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
    });
  } catch (err) {
    console.error("❌ Verification Error:", err);
    res.status(500).json({ msg: "Server error during verification." });
  }
};

/* ===========================
    LOGIN
=========================== */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required." });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // 2. Check verification status
    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email first." });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password." });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ msg: "Server error during login." });
  }
};
