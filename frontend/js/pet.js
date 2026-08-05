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

const logoutBtn = document.getElementById("logoutBtn");

const adoptBtn = document.getElementById("adoptBtn");

const message = document.getElementById("message");

// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Get Pet ID From URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const petId = params.get("id");

// ==========================================
// Load Pet
// ==========================================

loadPet();

// ==========================================
// Load Pet Function
// ==========================================

async function loadPet() {

    try {

        const response = await fetch(`${BASE_URL}/pets/${petId}`);

        const data = await response.json();

        const pet = data.pet;

        document.getElementById("petImage").src =
            pet.image.url;

        document.getElementById("petName").innerText =
            pet.petName;

        document.getElementById("breed").innerText =
            pet.breed;

        document.getElementById("species").innerText =
            pet.species;

        document.getElementById("age").innerText =
            pet.age;

        document.getElementById("gender").innerText =
            pet.gender;

        document.getElementById("color").innerText =
            pet.color;

        document.getElementById("vaccinated").innerText =
            pet.vaccinated ? "Yes" : "No";

        document.getElementById("health").innerText =
            pet.health;

        document.getElementById("location").innerText =
            pet.location;

        document.getElementById("description").innerText =
            pet.description;

        document.getElementById("owner").innerText =
            pet.owner.name;

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Adoption Request
// ==========================================

adoptBtn.addEventListener("click", sendRequest);

async function sendRequest() {

    try {

        const response = await fetch(`${BASE_URL}/adoptions`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                petId

            })

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

                Adoption Request Sent Successfully.

            </p>

        `;

    }

    catch (error) {

        console.log(error);

        message.innerHTML = `

            <p class="text-danger">

                Something went wrong.

            </p>

        `;

    }

}