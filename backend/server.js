require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// --- Route Imports ---
const authRoutes = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const skillsRouter = require("./routes/skills");
const contactRoutes = require("./routes/contact");
const aboutRoutes = require("./routes/about");
const adminRoutes = require("./routes/admin");
const testimonialRoutes = require("./routes/testimonial");
const homeHeroRoutes = require("./routes/homeHero"); 
const skillHeroRoutes = require("./routes/skillHero");
const projectHeroRoutes = require("./routes/projectHero");
const landingRoutes = require("./routes/landingHero");

const app = express();

// --- FIXED CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://my-portfolio-l9o0.onrender.com" // Your live frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps) or allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // --- API Endpoints (Note the /api prefix) ---
    app.use("/api/auth", authRoutes);
    app.use("/api/projects", projectsRouter);
    app.use("/api/skills", skillsRouter);
    app.use("/api/contact", contactRoutes);
    app.use("/api/about", aboutRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/testimonials", testimonialRoutes);
    app.use("/api/hero", homeHeroRoutes);      
    app.use("/api/skill-hero", skillHeroRoutes);  
    app.use("/api/project-hero", projectHeroRoutes); 
    app.use("/api/landing", landingRoutes); 

    app.get("/health", (req, res) => res.send("Portfolio Backend is running!"));

    // --- Production Frontend Serving ---
    if (process.env.NODE_ENV === "production") {
      const buildPath = path.join(__dirname, "client/build");
      app.use(express.static(buildPath));
      
      // Using named parameter for compatibility
      app.get("/:path*", (req, res) => {
        res.sendFile(path.resolve(buildPath, "index.html"));
      });
    }

    app.use((req, res) => res.status(404).json({ message: "Route not found" }));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

startServer();
