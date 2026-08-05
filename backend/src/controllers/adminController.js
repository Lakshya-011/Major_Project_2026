const User = require("../models/User");
const Pet = require("../models/Pet");

// ==========================================
// Get All Users
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalUsers: users.length,
            users,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Get All Pets
// ==========================================

const getAllPets = async (req, res) => {

    try {

        const pets = await Pet.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalPets: pets.length,
            pets,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Delete User
// ==========================================

const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Delete Pet
// ==========================================

const deletePet = async (req, res) => {

    try {

        const { id } = req.params;

        const pet = await Pet.findById(id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found.",
            });
        }

        await Pet.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Pet deleted successfully.",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    getAllUsers,
    getAllPets,
    deleteUser,
    deletePet,
};