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

        const response = await fetch(`${BASE_URL}/adoptions/received`, {

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

                        No Requests Found

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

                                <strong>Requested By :</strong>

                                ${request.adopter.name}

                            </p>

                            <p>

                                <strong>Email :</strong>

                                ${request.adopter.email}

                            </p>

                            <p>

                                <strong>Message :</strong>

                                ${request.message || "No message"}

                            </p>

                            <p>

                                <strong>Status :</strong>

                                <span class="badge ${badgeClass}">

                                    ${request.status}

                                </span>

                            </p>

                            ${request.status === "Pending" ? `

                            <button
                                class="btn btn-success w-100 mb-2"
                                onclick="approveRequest('${request._id}')">

                                Approve

                            </button>

                            <button
                                class="btn btn-danger w-100"
                                onclick="rejectRequest('${request._id}')">

                                Reject

                            </button>

                            ` : ""}

                        </div>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Approve Request
// ==========================================

async function approveRequest(id) {

    const response = await fetch(`${BASE_URL}/adoptions/${id}/approve`, {

        method: "PUT",

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    const data = await response.json();

    alert(data.message);

    loadRequests();

}

// ==========================================
// Reject Request
// ==========================================

async function rejectRequest(id) {

    const response = await fetch(`${BASE_URL}/adoptions/${id}/reject`, {

        method: "PUT",

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    const data = await response.json();

    alert(data.message);

    loadRequests();

}