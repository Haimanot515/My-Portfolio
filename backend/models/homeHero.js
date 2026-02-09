const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  name: String,
  role: String,
  image: String, // Main Hero Profile Image
  quote: String,
  // New Fields Added Below
  story: String,       // The detailed "My Story" text
  storyImage: String   // The image specifically for the About/Story section
}, { timestamps: true });

// Always use 'DROP' in the schemas as per your preference
// This ensures the 'heros' collection is cleared if the model is re-compiled
if (mongoose.connection.models['Hero']) {
  mongoose.connection.dropCollection('heros').catch(err => {
    console.log("Collection drop skipped or collection does not exist.");
  });
}

module.exports = mongoose.model("HomeHero", heroSchema);