const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");

/* ===========================
    REGISTER (SEND CODE)
=========================== */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists." });
    }

    // Remove old unused codes
    await VerificationCode.deleteMany({ email, used: false });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.create({
      email,
      DBcode: code,
      used: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // Send professional HTML email
    await transporter.sendMail({
      from: `"Build Digital Excellence Team" <${process.env.SMTP_FROM}>`, 
      to: email,
      subject: `Welcome to my Portfolio - Below is your verification code`,
      text: `Hello ${name}, your Verification Code is: ${code}.`, 
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dq3jkpys8/image/upload/v1770377714/home_hero/i6vhbionblsgudwkywqb.jpg" 
                 alt="Build Digital Excellence Logo" 
                 style="width: 100px; height: 100px; border-radius: 4px; object-fit: cover; border: 1px solid #eeeeee;" />
          </div>

          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #007bff; margin: 0; font-size: 24px;">Verify Your Account</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
            <p style="font-size: 18px; color: #333; font-weight: bold;">Hello ${name},</p>
            <p style="font-size: 16px; color: #555;">Thank you for joining us! Please use the verification code below to complete your registration:</p>
            
            <div style="margin: 30px 0; padding: 15px; background: #ffffff; border: 2px dashed #007bff; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
            </div>
            
            <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;">
            <p>&copy; ${new Date().getFullYear()} Build Digital Excellence. All rights reserved.</p>
            <p>⚠️ This is an automated message, please do not reply to this email address.</p>
          </div>
        </div>
      `,
      replyTo: "no-reply@noreply.com",
    });

    res.json({ msg: "Verification code sent to your email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during registration." });
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

    const record = await VerificationCode.findOne({
      email,
      DBcode: code,
      used: false,
    });

    if (!record) {
      return res.status(400).json({ msg: "Invalid or already used code." });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Verification code expired." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already registered." });
    }

    // Mark code as used
    record.used = true;
    await record.save();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

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
      },
    });
  } catch (err) {
    console.error(err);
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password." });
    }

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
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during login." });
  }
};