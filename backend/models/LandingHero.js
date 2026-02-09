const mongoose = require("mongoose");

// Always use 'DROP' in the schemas: 
// This ensures the collection is fresh and includes the new heroImage field
mongoose.connection.on("open", async () => {
  try {
    await mongoose.connection.db.dropCollection("landinghero");
    console.log("✅ Collection 'landinghero' DROPPED to sync new schema.");
  } catch (err) {
    console.log("ℹ️ Collection 'landinghero' not found or already dropped.");
  }
});

const LandingHeroSchema = new mongoose.Schema({
  // =====================
  // 1️⃣ HERO & MISSION (updateHero)
  // =====================
  title: { type: String, default: "Building Digital Excellence" },
  description: { type: String },
  heroImage: { type: String }, // 🚀 ADDED: Professional Hero Photo
  image: { type: String },     // Existing: Campus Background Image
  missionTitle: { type: String },
  missionDescription: { type: String },

  // =====================
  // 2️⃣ ACADEMIC AWARDS (updateAcademic)
  // =====================
  personalBio: { type: String },
  // Added field to support the dynamic bullet points
  awards: { 
    type: String, 
    default: "Top Academic Performer, Innovation Leader, Community Impact" 
  },
  aboutImage: { type: String }, // Award Image

  // =====================
  // 3️⃣ VIDEOS (updateVideos)
  // =====================
  mainShowcaseId: { type: String },
  selectedProjectId: { type: String },
  architectureId: { type: String },
  innovationId: { type: String },

  // =====================
  // 4️⃣ KNOWLEDGE & LIFESTYLE (updateLifestyle)
  // =====================
  tutorialDesc: { type: String },
  tutorialImage: { type: String },
  lifestyleDesc: { type: String },
  lifestyleImage: { type: String },

  // Metadata
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: "landinghero",
  // 'DROP' instruction: Forces Mongoose to handle index drops/syncs on startup
  autoIndex: true 
});

// Ensure only one document exists for the landing page
LandingHeroSchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.model("LandingHero", LandingHeroSchema);