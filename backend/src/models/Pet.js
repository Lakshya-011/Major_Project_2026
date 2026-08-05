const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        petName: {
            type: String,
            required: true,
            trim: true,
        },

        species: {
            type: String,
            required: true,
            trim: true,
        },

        breed: {
            type: String,
            required: true,
            trim: true,
        },

        age: {
            type: Number,
            required: true,
            min: 0,
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true,
        },

        color: {
            type: String,
            required: true,
            trim: true,
        },

        vaccinated: {
            type: Boolean,
            default: false,
        },

        health: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            url: {
                type: String,
                default: null,
            },
            public_id: {
                type: String,
                default: null,
            },
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isAdopted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Pet", petSchema);