const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get(
    "/stats",
    protect,
    adminMiddleware,
    getDashboardStats
);

module.exports = router;