const Skill = require("../models/Skill");

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const { name, level } = req.body;

    // Basic validation
    if (!name || !level) {
      return res.status(400).json({ msg: "Name and level are required" });
    }

    const skill = await Skill.create({ name, level });
    res.status(201).json({ msg: "Skill created successfully", skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
