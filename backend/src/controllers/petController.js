const mongoose = require("mongoose");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Pet = require("../models/Pet");

// ==========================================
// Upload Image To Cloudinary
// ==========================================

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "pets",
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
// Create Pet
// ==========================================

const createPet = async (req, res) => {

    try {

        const {
            petName,
            species,
            breed,
            age,
            gender,
            color,
            vaccinated,
            health,
            description,
            location,
        } = req.body;

        let image = {
            url: null,
            public_id: null,
        };

        if (req.file) {

            const uploadedImage = await uploadToCloudinary(req.file.buffer);

            image = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
            };

        }

        const pet = await Pet.create({
            petName,
            species,
            breed,
            age,
            gender,
            color,
            vaccinated,
            health,
            description,
            location,
            image,
            owner: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Pet created successfully.",
            pet,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Get All Pets (Search + Filter + Pagination + Sorting)
// ==========================================

const getAllPets = async (req, res) => {

    try {

        const {
            search,
            species,
            gender,
            location,
            adopted,
            page = 1,
            limit = 6,
            sort = "newest",
        } = req.query;

        let filter = {};

        // Search by Pet Name or Breed
        if (search) {
            filter.$or = [
                {
                    petName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    breed: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Filter by Species
        if (species) {
            filter.species = species;
        }

        // Filter by Gender
        if (gender) {
            filter.gender = gender;
        }

        // Filter by Location
        if (location) {
            filter.location = {
                $regex: location,
                $options: "i",
            };
        }

        // Filter by Adoption Status
        if (adopted !== undefined) {
            filter.isAdopted = adopted === "true";
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const totalPets = await Pet.countDocuments(filter);

        const pets = await Pet.find(filter)
            .populate("owner", "name email")
            .sort({
                createdAt: sort === "oldest" ? 1 : -1,
            })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPets / limitNumber),
            totalPets,
            count: pets.length,
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
// Get Single Pet
// ==========================================

const getPetById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pet ID.",
            });
        }

        const pet = await Pet.findById(id)
            .populate("owner", "name email");

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found.",
            });
        }

        res.status(200).json({
            success: true,
            pet,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================================
// Update Pet
// ==========================================

const updatePet = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pet ID.",
            });
        }

        const pet = await Pet.findById(id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found.",
            });
        }

        if (pet.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this pet.",
            });
        }

        const updatedData = {
            ...req.body,
        };

        if (req.file) {

            if (pet.image && pet.image.public_id) {
                await cloudinary.uploader.destroy(
                    pet.image.public_id
                );
            }

            const uploadedImage = await uploadToCloudinary(
                req.file.buffer
            );

            updatedData.image = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
            };
        }
                const updatedPet = await Pet.findByIdAndUpdate(
            id,
            updatedData,
            {
                new: true,
                runValidators: true,
            }
        ).populate("owner", "name email");

        res.status(200).json({
            success: true,
            message: "Pet updated successfully.",
            pet: updatedPet,
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pet ID.",
            });
        }

        const pet = await Pet.findById(id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found.",
            });
        }

        if (pet.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this pet.",
            });
        }

        // Delete image from Cloudinary
        if (pet.image && pet.image.public_id) {
            await cloudinary.uploader.destroy(
                pet.image.public_id
            );
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
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet,
};