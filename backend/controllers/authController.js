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
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @media screen and (max-width: 480px) {
          .container { width: 100% !important; border: none !important; border-radius: 0 !important; }
          .code { font-size: 24px !important; letter-spacing: 2px !important; }
          .logo { width: 80px !important; height: 80px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, sans-serif;">
      <center style="width: 100%; table-layout: fixed; background-color: #ffffff; padding: 20px 0;">
        <div class="container" style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          
          <div style="text-align: center; padding: 30px 20px 10px 20px;">
            <img class="logo" src="https://res.cloudinary.com/dq3jkpys8/image/upload/v1770377714/home_hero/i6vhbionblsgudwkywqb.jpg" 
                 alt="Logo" style="width: 100px; height: 100px; border-radius: 4px; object-fit: cover; border: 1px solid #eeeeee;" />
          </div>

          <div style="text-align: center; padding: 0 20px 20px 20px;">
            <h1 style="color: #0070f3; margin: 0; font-size: 24px; font-weight: 800;">Verify Your Account</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9; border-radius: 8px; margin: 0 20px; text-align: center;">
            <p style="font-size: 18px; color: #111; font-weight: bold; margin-top: 0;">Hello ${name},</p>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">Thank you for joining us! Use the code below to complete your registration:</p>
            
            <div class="code" style="margin: 25px 0; padding: 15px; background: #ffffff; border: 2px dashed #0070f3; display: inline-block; border-radius: 4px;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #111;">${code}</span>
            </div>
            
            <p style="font-size: 13px; color: #888; margin-bottom: 0;">
              This code will expire in 10 minutes. If you did not request this, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; padding: 30px 20px; font-size: 12px; color: #aaa;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Build Digital Excellence. All rights reserved.</p>
            <p style="margin: 5px 0;">⚠️ Automated message - Please do not reply.</p>
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
