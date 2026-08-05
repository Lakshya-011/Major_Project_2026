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

const requestContainer = document.getElementById("requestContainer");

const logoutBtn = document.getElementById("logoutBtn");

// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Load Requests
// ==========================================

loadRequests();

// ==========================================
// Load Requests Function
// ==========================================

async function loadRequests() {

    try {

        const response = await fetch(`${BASE_URL}/adoptions/my`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        requestContainer.innerHTML = "";

        if (data.totalRequests === 0) {

            requestContainer.innerHTML = `

                <div class="col-12 text-center">

                    <h3>

                        No Adoption Requests Found

                    </h3>

                </div>

            `;

            return;

        }

        data.requests.forEach((request) => {

            let badgeClass = "bg-warning";

            if (request.status === "Approved") {

                badgeClass = "bg-success";

            }

            if (request.status === "Rejected") {

                badgeClass = "bg-danger";

            }

            requestContainer.innerHTML += `

                <div class="col-lg-4 col-md-6 mb-4">

                    <div class="card shadow">

                        <img
                            src="${request.pet.image.url}"
                            class="card-img-top">

                        <div class="card-body">

                            <h4 class="card-title">

                                ${request.pet.petName}

                            </h4>

                            <p>

                                <strong>Owner :</strong>

                                ${request.owner.name}

                            </p>

                            <p>

                                <strong>Location :</strong>

                                ${request.pet.location}

                            </p>

                            <p>

                                <strong>Status :</strong>

                                <span class="badge ${badgeClass}">

                                    ${request.status}

                                </span>

                            </p>

                            <p>

                                <strong>Message :</strong>

                                ${request.message || "No message"}

                            </p>

                            <a
                                href="pet.html?id=${request.pet._id}"
                                class="btn btn-success w-100">

                                View Pet

                            </a>

                        </div>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

        requestContainer.innerHTML = `

            <div class="col-12 text-center">

                <h3 class="text-danger">

                    Failed to Load Requests

                </h3>

            </div>

        `;

    }

}