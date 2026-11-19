
const mongoose = require("mongoose");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Rescue = require("../models/Rescue");

// ==========================================
// Upload Image To Cloudinary
// ==========================================

const uploadToCloudinary = (buffer) => {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "pawshield-rescue",
            },
            (error, result) => {

                if (error) return reject(error);

                resolve(result);

            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);

    });

};

// ==========================================
// Create Rescue Report
// ==========================================

const createRescueReport = async (req, res) => {

    try {

        const {
            animalType,
            condition,
            description,
            urgency,
            address,
            latitude,
            longitude,
            contactName,
            contactPhone,
        } = req.body;

        if (
            !animalType ||
            !condition ||
            !description ||
            !address ||
            !contactName ||
            !contactPhone
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide all required information.",
            });

        }

        let image = {
            url: null,
            public_id: null,
        };

        if (req.file) {

            const uploadedImage = await uploadToCloudinary(
                req.file.buffer
            );

            image = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
            };

        }

        const rescue = await Rescue.create({

            reporter: req.user.id,

            animalType,
            condition,
            description,
            urgency: urgency || "Medium",

            location: {
                address,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
            },

            contactName,
            contactPhone,
            image,

        });

        res.status(201).json({

            success: true,
            message: "Rescue report submitted successfully.",
            rescue,

        });

    } catch (error) {

        console.error("Create Rescue Error:", error);

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

// ==========================================
// Get Logged-in User's Rescue Reports
// ==========================================

const getMyRescueReports = async (req, res) => {

    try {

        const reports = await Rescue.find({
            reporter: req.user.id,
        })
        .populate("reporter", "name email")
        .populate("assignedVolunteer", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,
            count: reports.length,
            reports,

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

// ==========================================
// Get All Rescue Reports - Admin Only
// ==========================================

const getAllRescueReports = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,
                message: "Admin access required.",

            });

        }

        const reports = await Rescue.find()
            .populate("reporter", "name email")
            .populate("assignedVolunteer", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,
            count: reports.length,
            reports,

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

// ==========================================
// Update Rescue Status - Admin Only
// ==========================================

const updateRescueStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status, rescueNotes, assignedVolunteer } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,
                message: "Invalid rescue report ID.",

            });

        }

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,
                message: "Admin access required.",

            });

        }

        const allowedStatuses = [
            "Pending",
            "Assigned",
            "Rescue in Progress",
            "Rescued",
            "Completed",
            "Rejected",
        ];

        if (status && !allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,
                message: "Invalid rescue status.",

            });

        }

        const updatedData = {};

        if (status) updatedData.status = status;

        if (rescueNotes !== undefined) {
            updatedData.rescueNotes = rescueNotes;
        }

        if (assignedVolunteer !== undefined) {

            if (
                assignedVolunteer !== null &&
                !mongoose.Types.ObjectId.isValid(assignedVolunteer)
            ) {

                return res.status(400).json({

                    success: false,
                    message: "Invalid volunteer ID.",

                });

            }

            updatedData.assignedVolunteer = assignedVolunteer;

        }

        const rescue = await Rescue.findByIdAndUpdate(
            id,
            updatedData,
            {
                new: true,
                runValidators: true,
            }
        )
        .populate("reporter", "name email")
        .populate("assignedVolunteer", "name email");

        if (!rescue) {

            return res.status(404).json({

                success: false,
                message: "Rescue report not found.",

            });

        }

        res.status(200).json({

            success: true,
            message: "Rescue report updated successfully.",
            rescue,

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

// ==========================================
// Get Single Rescue Report
// ==========================================

const getRescueReportById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,
                message: "Invalid rescue report ID.",

            });

        }

        const rescue = await Rescue.findById(id)
            .populate("reporter", "name email")
            .populate("assignedVolunteer", "name email");

        if (!rescue) {

            return res.status(404).json({

                success: false,
                message: "Rescue report not found.",

            });

        }

        const isReporter =
            rescue.reporter._id.toString() === req.user.id;

        const isAdmin = req.user.role === "admin";

        if (!isReporter && !isAdmin) {

            return res.status(403).json({

                success: false,
                message: "You are not authorized to view this report.",

            });

        }

        res.status(200).json({

            success: true,
            rescue,

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

module.exports = {
    createRescueReport,
    getMyRescueReports,
    getAllRescueReports,
    updateRescueStatus,
    getRescueReportById,
};
