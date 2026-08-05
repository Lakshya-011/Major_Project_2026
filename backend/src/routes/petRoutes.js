const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet,
} = require("../controllers/petController");

const router = express.Router();

// Public Routes
router.get("/", getAllPets);
router.get("/:id", getPetById);

// Protected Routes
router.post("/", protect, upload.single("image"), createPet);
router.put("/:id", protect, upload.single("image"), updatePet);
router.delete("/:id", protect, deletePet);

module.exports = router;