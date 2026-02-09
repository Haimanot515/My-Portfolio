const LandingHero = require("../models/LandingHero");
const cloudinary = require("../config/cloudinary");

// Internal helper for Cloudinary Uploads
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "portfolio", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// GET Landing Data
exports.getLanding = async (req, res) => {
  try {
    const landing = await LandingHero.findOne();
    res.json(landing || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
};

// 1️⃣ UPDATE HERO & MY CAMPUS
exports.updateHero = async (req, res) => {
  try {
    const { title, description, missionTitle, missionDescription, mainShowcaseId } = req.body;
    let updateData = { 
      title, 
      description, 
      missionTitle, 
      missionDescription, 
      updatedAt: Date.now() 
    };

    // Handle Hero Image and Campus Image using req.files
    if (req.files) {
      if (req.files.heroImage) {
        updateData.heroImage = await uploadToCloudinary(req.files.heroImage[0].buffer);
      }
      if (req.files.campusImage) {
        updateData.image = await uploadToCloudinary(req.files.campusImage[0].buffer);
      }
    } else if (req.file) {
      // Fallback if only one file is sent via req.file
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    if (mainShowcaseId) {
      updateData.mainShowcaseId = mainShowcaseId;
    }

    const landing = await LandingHero.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });
    res.json(landing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update hero and campus" });
  }
};

// 2️⃣ UPDATE ACADEMIC AWARDS (Updated to include awards field)
exports.updateAcademic = async (req, res) => {
  try {
    const { personalBio, awards } = req.body; // 'awards' is the comma-separated string from Admin
    let updateData = { 
      personalBio, 
      awards, 
      updatedAt: Date.now() 
    };

    if (req.file) {
      updateData.aboutImage = await uploadToCloudinary(req.file.buffer);
    }

    const landing = await LandingHero.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });
    res.json(landing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update academic" });
  }
};

// 3️⃣ UPDATE VIDEOS
exports.updateVideos = async (req, res) => {
  try {
    const { mainShowcaseId, selectedProjectId, architectureId, innovationId } = req.body;
    let updateData = { updatedAt: Date.now() };

    if (req.files?.mainShowcaseFile) {
        updateData.mainShowcaseId = await uploadToCloudinary(req.files.mainShowcaseFile[0].buffer);
    } else if (mainShowcaseId) {
        updateData.mainShowcaseId = mainShowcaseId;
    }

    if (req.files?.selectedProjectFile) {
        updateData.selectedProjectId = await uploadToCloudinary(req.files.selectedProjectFile[0].buffer);
    } else if (selectedProjectId) {
        updateData.selectedProjectId = selectedProjectId;
    }

    if (req.files?.architectureFile) {
        updateData.architectureId = await uploadToCloudinary(req.files.architectureFile[0].buffer);
    } else if (architectureId) {
        updateData.architectureId = architectureId;
    }

    if (req.files?.innovationFile) {
        updateData.innovationId = await uploadToCloudinary(req.files.innovationFile[0].buffer);
    } else if (innovationId) {
        updateData.innovationId = innovationId;
    }

    const landing = await LandingHero.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });
    res.json(landing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update videos" });
  }
};

// 4️⃣ UPDATE KNOWLEDGE & LIFESTYLE
exports.updateLifestyle = async (req, res) => {
  try {
    const { tutorialDesc, lifestyleDesc } = req.body;
    let updateData = { tutorialDesc, lifestyleDesc, updatedAt: Date.now() };

    if (req.files?.tutorialImage) {
        updateData.tutorialImage = await uploadToCloudinary(req.files.tutorialImage[0].buffer);
    }
    if (req.files?.lifestyleImage) {
        updateData.lifestyleImage = await uploadToCloudinary(req.files.lifestyleImage[0].buffer);
    }

    const landing = await LandingHero.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });
    res.json(landing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update lifestyle" });
  }
};