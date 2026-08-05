const User = require("../models/User");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");

const getDashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalPets = await Pet.countDocuments();

        const availablePets = await Pet.countDocuments({
            isAdopted: false,
        });

        const adoptedPets = await Pet.countDocuments({
            isAdopted: true,
        });

        const pendingRequests = await AdoptionRequest.countDocuments({
            status: "Pending",
        });

        const approvedRequests = await AdoptionRequest.countDocuments({
            status: "Approved",
        });

        const rejectedRequests = await AdoptionRequest.countDocuments({
            status: "Rejected",
        });

        res.status(200).json({
            success: true,
            dashboard: {
                totalUsers,
                totalPets,
                availablePets,
                adoptedPets,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    getDashboardStats,
};