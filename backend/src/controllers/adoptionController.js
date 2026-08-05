const mongoose = require("mongoose");

const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");

// ==========================================
// Send Adoption Request
// ==========================================

const sendAdoptionRequest = async (req, res) => {
    try {

        const { petId, message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pet ID.",
            });
        }

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found.",
            });
        }

        if (pet.isAdopted) {
            return res.status(400).json({
                success: false,
                message: "This pet has already been adopted.",
            });
        }

        if (pet.owner.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot adopt your own pet.",
            });
        }

        const existingRequest = await AdoptionRequest.findOne({
            pet: petId,
            adopter: req.user.id,
            status: "Pending",
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending request.",
            });
        }

        const adoptionRequest = await AdoptionRequest.create({
            pet: pet._id,
            adopter: req.user.id,
            owner: pet.owner,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Adoption request sent successfully.",
            adoptionRequest,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ==========================================
// Get My Requests
// ==========================================

const getMyRequests = async (req, res) => {

    try {

        const requests = await AdoptionRequest.find({
            adopter: req.user.id,
        })
            .populate("pet")
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalRequests: requests.length,
            requests,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Get Received Requests
// ==========================================

const getReceivedRequests = async (req, res) => {

    try {

        const requests = await AdoptionRequest.find({
            owner: req.user.id,
        })
            .populate("pet")
            .populate("adopter", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalRequests: requests.length,
            requests,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Approve Request
// ==========================================

const approveRequest = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
        }

        const request = await AdoptionRequest.findById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found.",
            });
        }

        if (request.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Request already processed.",
            });
        }

        const pet = await Pet.findById(request.pet);

        if (pet.isAdopted) {
            return res.status(400).json({
                success: false,
                message: "Pet already adopted.",
            });
        }

        request.status = "Approved";
                await request.save();

        pet.isAdopted = true;
        await pet.save();

        // Reject all other pending requests for this pet
        await AdoptionRequest.updateMany(
            {
                pet: request.pet,
                _id: { $ne: request._id },
                status: "Pending",
            },
            {
                $set: {
                    status: "Rejected",
                },
            }
        );

        res.status(200).json({
            success: true,
            message: "Adoption request approved successfully.",
            request,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Reject Request
// ==========================================

const rejectRequest = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
        }

        const request = await AdoptionRequest.findById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found.",
            });
        }

        if (request.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Request already processed.",
            });
        }

        request.status = "Rejected";

        await request.save();

        res.status(200).json({
            success: true,
            message: "Adoption request rejected successfully.",
            request,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    sendAdoptionRequest,
    getMyRequests,
    getReceivedRequests,
    approveRequest,
    rejectRequest,
};