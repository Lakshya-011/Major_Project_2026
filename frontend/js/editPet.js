
// ==========================================
// Route Protection
// ==========================================

const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "login.html";

}

// ==========================================
// DOM Elements
// ==========================================

const editPetForm = document.getElementById("editPetForm");

const message = document.getElementById("message");

const logoutBtn = document.getElementById("logoutBtn");

const updateBtn = document.getElementById("updateBtn");

const currentPetImage = document.getElementById("currentPetImage");

// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) {

        return;

    }

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Get Pet ID From URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const petId = params.get("id");

if (!petId) {

    alert("Pet ID is missing.");

    window.location.href = "dashboard.html";

}

// ==========================================
// Load Existing Pet Details
// ==========================================

loadPet();

// ==========================================
// Load Pet Function
// ==========================================

async function loadPet() {

    try {

        const response = await fetch(`${BASE_URL}/pets/${petId}`);

        const data = await response.json();

        if (!response.ok || !data.success) {

            message.innerHTML = `

                <p class="text-danger">

                    ${data.message || "Unable to load pet details."}

                </p>

            `;

            return;

        }

        const pet = data.pet;

        // Fill Form Fields

        document.getElementById("petName").value = pet.petName || "";

        document.getElementById("species").value = pet.species || "";

        document.getElementById("breed").value = pet.breed || "";

        document.getElementById("age").value = pet.age ?? "";

        document.getElementById("gender").value = pet.gender || "";

        document.getElementById("color").value = pet.color || "";

        document.getElementById("vaccinated").value =
            String(pet.vaccinated);

        document.getElementById("health").value = pet.health || "";

        document.getElementById("description").value =
            pet.description || "";

        document.getElementById("location").value =
            pet.location || "";

        // Show Existing Image

        if (pet.image && pet.image.url) {

            currentPetImage.src = pet.image.url;

            currentPetImage.style.display = "inline-block";

        } else {

            currentPetImage.style.display = "none";

        }

    }

    catch (error) {

        console.error(error);

        message.innerHTML = `

            <p class="text-danger">

                Something went wrong while loading pet details.

            </p>

        `;

    }

}

// ==========================================
// Update Form Submit Event
// ==========================================

editPetForm.addEventListener("submit", updatePet);

// ==========================================
// Update Pet Function
// ==========================================

async function updatePet(event) {

    event.preventDefault();

    message.innerHTML = "";

    updateBtn.disabled = true;

    updateBtn.innerHTML = `

        <span class="spinner-border spinner-border-sm"></span>

        Updating...

    `;

    const formData = new FormData();

    formData.append(
        "petName",
        document.getElementById("petName").value
    );

    formData.append(
        "species",
        document.getElementById("species").value
    );

    formData.append(
        "breed",
        document.getElementById("breed").value
    );

    formData.append(
        "age",
        document.getElementById("age").value
    );

    formData.append(
        "gender",
        document.getElementById("gender").value
    );

    formData.append(
        "color",
        document.getElementById("color").value
    );

    formData.append(
        "vaccinated",
        document.getElementById("vaccinated").value
    );

    formData.append(
        "health",
        document.getElementById("health").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    formData.append(
        "location",
        document.getElementById("location").value
    );

    // Add New Image Only If Selected

    const image = document.getElementById("image").files[0];

    if (image) {

        formData.append("image", image);

    }

    try {

        const response = await fetch(`${BASE_URL}/pets/${petId}`, {

            method: "PUT",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

        const data = await response.json();

        if (!response.ok || !data.success) {

            message.innerHTML = `

                <p class="text-danger">

                    ${data.message || "Unable to update pet."}

                </p>

            `;

            return;

        }

        message.innerHTML = `

            <p class="text-success">

                Pet Updated Successfully!

            </p>

        `;

        setTimeout(() => {

            window.location.href = `pet.html?id=${petId}`;

        }, 1500);

    }

    catch (error) {

        console.error(error);

        message.innerHTML = `

            <p class="text-danger">

                Something went wrong while updating the pet.

            </p>

        `;

    }

    finally {

        updateBtn.disabled = false;

        updateBtn.innerHTML = `

            <i class="fa-solid fa-save"></i>

            Update Pet

        `;

    }

}
