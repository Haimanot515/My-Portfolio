const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminMiddleware");
const { getSkills, createSkill } = require("../controllers/skillController");

router.get("/",auth, getSkills);
router.post("/", auth,adminAuth, createSkill);

module.exports = router;
