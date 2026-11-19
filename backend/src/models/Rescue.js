
const mongoose = require("mongoose");

const rescueSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        animalType: {
            type: String,
            enum: ["Dog", "Cat", "Cow", "Bird", "Other"],
            required: true,
        },

        condition: {
            type: String,
            enum: [
                "Injured",
                "Accident",
                "Critical",
                "Abandoned",
                "Sick",
                "Other",
            ],
            required: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        urgency: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },

        location: {
            address: {
                type: String,
                required: true,
                trim: true,
            },

            latitude: {
                type: Number,
                default: null,
            },

            longitude: {
                type: Number,
                default: null,
            },
        },

        contactName: {
            type: String,
            required: true,
            trim: true,
        },

        contactPhone: {
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

        status: {
            type: String,
            enum: [
                "Pending",
                "Assigned",
                "Rescue in Progress",
                "Rescued",
                "Completed",
                "Rejected",
            ],
            default: "Pending",
        },

        assignedVolunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        rescueNotes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Rescue", rescueSchema);
