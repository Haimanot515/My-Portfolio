const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminMiddleware");
const { getSkills, createSkill } = require("../controllers/skillController");
/* IMPORT MULTER MIDDLEWARE */
const upload = require("../middleware/multerMiddleware"); // Ensure this path matches your file structure

router.get("/", auth, getSkills);

/* ADDED upload.single("image") TO PARSE THE FORMDATA */
router.post("/", auth, adminAuth, upload.single("image"), createSkill);

module.exports = router;
