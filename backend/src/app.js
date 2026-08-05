const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// =========================
// Middlewares
// =========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// =========================
// Test Route
// =========================

app.get("/", (req, res) => {
    res.send("Pet Adoption API is Running...");
});

// =========================
// Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/pets", petRoutes);

app.use("/api/adoptions", adoptionRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/dashboard", dashboardRoutes);

// =========================
// 404 Route
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

// =========================
// Global Error Handler
// =========================

app.use(errorMiddleware);

module.exports = app;