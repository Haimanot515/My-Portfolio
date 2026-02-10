require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// --- Standard Routes ---
const authRoutes = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const skillsRouter = require("./routes/skills");
const contactRoutes = require("./routes/contact");
const aboutRoutes = require("./routes/about");
const adminRoutes = require("./routes/admin");
const testimonialRoutes = require("./routes/testimonial");

// --- Hero Triad Routes ---
const homeHeroRoutes = require("./routes/homeHero"); 
const skillHeroRoutes = require("./routes/skillHero");
const projectHeroRoutes = require("./routes/projectHero");

// --- 🆕 Independent Landing Route ---
const landingRoutes = require("./routes/landingHero");

const app = express();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Static folder for local image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// Database + Server
// --------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // --- Standard API Endpoints ---
    app.use("/api/auth", authRoutes);
    app.use("/api/projects", projectsRouter);
    app.use("/api/skills", skillsRouter);
    app.use("/api/contact", contactRoutes);
    app.use("/api/about", aboutRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/testimonials", testimonialRoutes);

    // --- Hero Triad API Endpoints ---
    app.use("/api/hero", homeHeroRoutes);      
    app.use("/api/skill-hero", skillHeroRoutes);  
    app.use("/api/project-hero", projectHeroRoutes); 

    // --- 🆕 Independent Landing API Endpoint ---
    app.use("/api/landing", landingRoutes); 

    // Health check
    app.get("/health", (req, res) => {
      res.send("Portfolio Backend is running!");
    });

    // ---------------------------------------------------------
    // PRODUCTION FRONTEND SERVING
    // ---------------------------------------------------------
    if (process.env.NODE_ENV === "production") {
      const buildPath = path.join(__dirname, "client/build");
      app.use(express.static(buildPath));
      
      // ✅ THE CRITICAL FIX:
      // Change '/*' to '/:path*'
      // This gives the parameter a name ('path'), which is required by Express 5
      app.get("/:path*", (req, res) => {
        res.sendFile(path.resolve(buildPath, "index.html"));
      });
    }

    // 404 handler (Fallback for missing API routes)
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Server error" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

startServer();
