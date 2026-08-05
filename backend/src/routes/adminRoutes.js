const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getAllPets,
    deleteUser,
    deletePet,
} = require("../controllers/adminController");

const router = express.Router();

// Apply middleware to all routes below
router.use(protect);
router.use(adminMiddleware);

// User Routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Pet Routes
router.get("/pets", getAllPets);
router.delete("/pets/:id", deletePet);

module.exports = router;