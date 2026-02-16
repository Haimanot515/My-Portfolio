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
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Base Resets */
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f7f9; }
    
    /* Responsive Queries */
    @media screen and (max-width: 480px) {
      .main-card { width: 100% !important; border-radius: 0 !important; box-shadow: none !important; }
      .code-display { font-size: 28px !important; letter-spacing: 4px !important; padding: 12px !important; }
      .header-text { font-size: 22px !important; }
      .responsive-padding { padding: 20px !important; }
    }

    /* Modern Hover Effect for Buttons/Links */
    .btn:hover { background-color: #0056b3 !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <center style="width: 100%; table-layout: fixed; background-color: #f4f7f9; padding: 40px 0;">
    
    <div class="main-card" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e1e8ed;">
      
      <div style="height: 6px; background: linear-gradient(90deg, #0070f3, #00c6ff);"></div>

      <div style="padding: 40px 20px 20px 20px; text-align: center;">
        <img src="https://res.cloudinary.com/dq3jkpys8/image/upload/v1770377714/home_hero/i6vhbionblsgudwkywqb.jpg" 
             alt="Build Digital Excellence Logo" 
             style="width: 90px; height: 90px; border-radius: 12px; object-fit: cover; border: 2px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" />
        <h1 class="header-text" style="color: #111111; margin: 20px 0 0 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Verify Your Account</h1>
      </div>

      <div class="responsive-padding" style="padding: 0 40px 40px 40px; text-align: center;">
        <p style="font-size: 18px; color: #333333; font-weight: 600; margin-bottom: 10px;">Hello ${name},</p>
        <p style="font-size: 16px; color: #666666; line-height: 1.6; margin-bottom: 30px;">
          Welcome to <strong>Build Digital Excellence</strong>. We're excited to have you! Use the secure code below to verify your identity.
        </p>

        <div style="background-color: #f8fbff; border: 1px solid #d0e3ff; border-radius: 12px; padding: 30px 20px; margin-bottom: 30px;">
          <div class="code-display" style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0070f3; display: inline-block;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #0070f3; margin-top: 15px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Security Token</p>
        </div>

        <p style="font-size: 14px; color: #999999; line-height: 1.5;">
          This verification link is valid for <strong>10 minutes</strong>.<br>
          If you didn't create an account, you can safely ignore this email.
        </p>
        
        <div style="margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 30px;">
          <p style="font-size: 14px; color: #666666; margin-bottom: 15px;">Connect with me:</p>
          <div style="display: inline-block;">
            <a href="https://github.com/Haimanot515" style="text-decoration: none; margin: 0 10px; color: #111; font-weight: bold; font-size: 13px;">GitHub</a>
            <a href="#" style="text-decoration: none; margin: 0 10px; color: #0070f3; font-weight: bold; font-size: 13px;">LinkedIn</a>
            <a href="https://t.me/haimasearchjobplanstart" style="text-transform: none; text-decoration: none; margin: 0 10px; color: #0088cc; font-weight: bold; font-size: 13px;">Telegram</a>
          </div>
        </div>
      </div>

      <div style="background-color: #fafbfc; padding: 30px 20px; text-align: center; border-top: 1px solid #f0f0f0;">
        <p style="margin: 0; font-size: 12px; color: #777777; font-weight: 600;">&copy; ${new Date().getFullYear()} Build Digital Excellence</p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #bbbbbb; text-transform: uppercase; letter-spacing: 0.5px;">Addis Ababa, Ethiopia</p>
        <div style="margin-top: 15px; font-size: 10px; color: #cccccc; line-height: 1.4;">
          This is an automated system message. To ensure delivery, please add my email to your safe-sender list.
        </div>
      </div>

    </div>
  </center>
</body>
</html>`;

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
