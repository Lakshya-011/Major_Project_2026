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

const petForm = document.getElementById("petForm");

const message = document.getElementById("message");

const logoutBtn = document.getElementById("logoutBtn");

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
// Submit Form
// ==========================================

petForm.addEventListener("submit", createPet);

// ==========================================
// Create Pet Function
// ==========================================

async function createPet(event) {

    event.preventDefault();

    message.innerHTML = "";

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

    const image = document.getElementById("image").files[0];

    if (image) {

        formData.append("image", image);

    }

    try {

        const response = await fetch(`${BASE_URL}/pets`, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

        const data = await response.json();

        if (!data.success) {

            message.innerHTML = `

                <p class="text-danger">

                    ${data.message}

                </p>

            `;

            return;

        }

        message.innerHTML = `

            <p class="text-success">

                Pet Added Successfully.

            </p>

        `;

        petForm.reset();

        setTimeout(() => {

            window.location.href = "pets.html";

        }, 1500);

    }

    catch (error) {

        console.error(error);

        message.innerHTML = `

            <p class="text-danger">

                Something went wrong.

            </p>

        `;

    }

}