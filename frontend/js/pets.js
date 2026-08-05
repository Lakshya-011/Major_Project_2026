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

const petContainer = document.getElementById("petContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================================
// Load Pets
// ==========================================

loadPets();

// ==========================================
// Search Button
// ==========================================

searchBtn.addEventListener("click", () => {

    loadPets(searchInput.value);

});

// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Load Pets Function
// ==========================================

async function loadPets(search = "") {

    try {

        let url = `${BASE_URL}/pets`;

        if (search) {

            url += `?search=${search}`;

        }

        const response = await fetch(url);

        const data = await response.json();

        petContainer.innerHTML = "";

        if (data.count === 0) {

            petContainer.innerHTML = `

                <h3 class="text-center">

                    No Pets Found

                </h3>

            `;

            return;

        }

        data.pets.forEach((pet) => {

            petContainer.innerHTML += `

            <div class="col-lg-4 col-md-6 mb-4">

                <div class="card pet-card shadow">

                    <img
                        src="${pet.image.url}"
                        class="card-img-top">

                    <div class="card-body">

                        <h4 class="card-title">

                            ${pet.petName}

                        </h4>

                        <p>

                            <strong>Breed:</strong>

                            ${pet.breed}

                        </p>

                        <p>

                            <strong>Age:</strong>

                            ${pet.age} Years

                        </p>

                        <p>

                            <strong>Location:</strong>

                            ${pet.location}

                        </p>

                        <span class="badge bg-success">

                            ${pet.species}

                        </span>

                        <div class="mt-3">

                            <a
                                href="pet.html?id=${pet._id}"
                                class="btn btn-success w-100">

                                View Details

                            </a>

                        </div>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

        petContainer.innerHTML = `

            <h3 class="text-danger">

                Failed to Load Pets

            </h3>

        `;

    }

}