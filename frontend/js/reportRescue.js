
document.addEventListener("DOMContentLoaded", () => {
    const rescueForm = document.getElementById("rescueForm");
    const message = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");
    const locationBtn = document.getElementById("locationBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }

    function showMessage(text, type = "danger") {
        message.textContent = text;
        message.className = `alert alert-${type}`;
        message.classList.remove("d-none");
    }

    // Capture current GPS coordinates
    if (locationBtn) {
        locationBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                showMessage("Geolocation is not supported by your browser.");
                return;
            }

            locationBtn.disabled = true;
            locationBtn.textContent = "Getting location...";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    document.getElementById("latitude").value =
                        position.coords.latitude;

                    document.getElementById("longitude").value =
                        position.coords.longitude;

                    showMessage(
                        "GPS location captured successfully. Please enter the complete address manually.",
                        "success"
                    );

                    locationBtn.disabled = false;
                    locationBtn.textContent = "Use My Current Location";
                },
                (error) => {
                    let errorMessage = "Unable to get your location.";

                    if (error.code === error.PERMISSION_DENIED) {
                        errorMessage = "Location permission was denied. Please allow location access.";
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMessage = "Your current location is unavailable.";
                    } else if (error.code === error.TIMEOUT) {
                        errorMessage = "Location request timed out. Please try again.";
                    }

                    showMessage(errorMessage);

                    locationBtn.disabled = false;
                    locationBtn.textContent = "Use My Current Location";
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });
    }

    // Submit rescue report
    rescueForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const imageInput = document.getElementById("image");
        const image = imageInput.files[0];

        // Image validation
        if (image) {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(image.type)) {
                showMessage("Please upload a JPG, PNG, or WebP image.");
                return;
            }

            if (image.size > 5 * 1024 * 1024) {
                showMessage("Image size must be less than 5 MB.");
                return;
            }
        }

        const formData = new FormData();

        formData.append(
            "animalType",
            document.getElementById("animalType").value
        );

        formData.append(
            "condition",
            document.getElementById("condition").value
        );

        formData.append(
            "urgency",
            document.getElementById("urgency").value
        );

        formData.append(
            "description",
            document.getElementById("description").value.trim()
        );

        formData.append(
            "address",
            document.getElementById("address").value.trim()
        );

        formData.append(
            "latitude",
            document.getElementById("latitude").value
        );

        formData.append(
            "longitude",
            document.getElementById("longitude").value
        );

        formData.append(
            "contactName",
            document.getElementById("contactName").value.trim()
        );

        formData.append(
            "contactPhone",
            document.getElementById("contactPhone").value.trim()
        );

        if (image) {
            formData.append("image", image);
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting Report...";

            message.classList.add("d-none");

            const response = await fetch(`${BASE_URL}/rescues`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit rescue report."
                );
            }

            showMessage(
                "Rescue report submitted successfully! Our team can now review it.",
                "success"
            );

            rescueForm.reset();

            document.getElementById("latitude").value = "";
            document.getElementById("longitude").value = "";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {
            showMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Rescue Report";
        }
    });
});
