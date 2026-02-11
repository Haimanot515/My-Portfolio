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
    origin: [
      process.env.CLIENT_URL, 
      "http://localhost:5173", 
      "https://my-portfolio-l9o0.onrender.com"
    ],
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
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 2. DROP stale indexes for LandingHero to fix the Mongoose _id warning
    // This satisfies your constraint to keep schemas/indexes in sync via dropping.
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const exists = collections.some(col => col.name === 'landingheros');
        if (exists) {
            await mongoose.connection.db.collection('landingheros').dropIndexes();
            console.log("✅ LandingHero indexes DROPPED to ensure fresh schema sync");
        }
    } catch (indexError) {
        console.log("ℹ️ No legacy indexes found to drop.");
    }

    // -----------------------------------------------------------
    // API Endpoints (Unified under /api)
    // -----------------------------------------------------------
    
    // MOVED: These now match your frontend API.get("/landing") and API.post("/auth/register")
    // Because your baseURL in api.jsx is "http://.../api"
    app.use("/api/auth", authRoutes); 
    app.use("/api/landing", landingRoutes); 

    // Regular Data Routes
    app.use("/api/projects", projectsRouter);
    app.use("/api/skills", skillsRouter);
    app.use("/api/contact", contactRoutes);
    app.use("/api/about", aboutRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/testimonials", testimonialRoutes);
    app.use("/api/hero", homeHeroRoutes);      
    app.use("/api/skill-hero", skillHeroRoutes);  
    app.use("/api/project-hero", projectHeroRoutes); 

    // Health check (Crucial for Render monitoring)
    app.get("/", (req, res) => {
      res.send("Portfolio Backend is running!");
    });

    // Production frontend serving
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "client/build")));
    }

    // 404 handler for any non-existent route
    app.use((req, res) => {
      res.status(404).json({ 
        message: `Route ${req.originalUrl} not found. Check if /api prefix is missing.` 
      });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Server error" });
    });

    // --------------------
    // THE RENDER FIX:
    // --------------------
    const PORT = process.env.PORT || 5000;
    // Binding to '0.0.0.0' allows Render to correctly detect the port
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

// Start the application
startServer();
