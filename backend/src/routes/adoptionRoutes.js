const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    sendAdoptionRequest,
    getMyRequests,
    getReceivedRequests,
    approveRequest,
    rejectRequest,
} = require("../controllers/adoptionController");

const router = express.Router();

// Send Request
router.post("/", protect, sendAdoptionRequest);

// My Requests
router.get("/my", protect, getMyRequests);

// Received Requests
router.get("/received", protect, getReceivedRequests);

// Approve Request
router.put("/:id/approve", protect, approveRequest);

// Reject Request
router.put("/:id/reject", protect, rejectRequest);

module.exports = router;