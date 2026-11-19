
const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createRescueReport,
    getMyRescueReports,
    getAllRescueReports,
    updateRescueStatus,
    getRescueReportById,
} = require("../controllers/rescueController");

const router = express.Router();

// All rescue routes require login
router.use(protect);

// Submit a new rescue report
router.post(
    "/",
    upload.single("image"),
    createRescueReport
);

// Get logged-in user's reports
router.get(
    "/my-reports",
    getMyRescueReports
);

// Get all reports - Admin only
router.get(
    "/",
    getAllRescueReports
);

// Get a single rescue report
router.get(
    "/:id",
    getRescueReportById
);

// Update rescue report - Admin only
router.put(
    "/:id",
    updateRescueStatus
);

module.exports = router;
