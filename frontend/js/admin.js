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

const usersContainer = document.getElementById("usersContainer");
const petsContainer = document.getElementById("petsContainer");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================================
// Initial Load
// ==========================================

loadDashboard();
loadUsers();
loadPets();

// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================================
// Dashboard Stats
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(`${BASE_URL}/dashboard/stats`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        document.getElementById("totalUsers").innerText =
            data.dashboard.totalUsers;

        document.getElementById("totalPets").innerText =
            data.dashboard.totalPets;

        document.getElementById("pendingRequests").innerText =
            data.dashboard.pendingRequests;

        document.getElementById("approvedRequests").innerText =
            data.dashboard.approvedRequests;

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Load Users
// ==========================================

async function loadUsers() {

    try {

        const response = await fetch(`${BASE_URL}/admin/users`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        usersContainer.innerHTML = "";

        if (data.totalUsers === 0) {

            usersContainer.innerHTML = `

                <p>No Users Found</p>

            `;

            return;

        }

        data.users.forEach(user => {

            usersContainer.innerHTML += `

                <div class="user-card">

                    <h5>${user.name}</h5>

                    <p>${user.email}</p>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteUser('${user._id}')">

                        Delete User

                    </button>

                </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Load Pets
// ==========================================

async function loadPets() {

    try {

        const response = await fetch(`${BASE_URL}/admin/pets`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        petsContainer.innerHTML = "";

        if (data.totalPets === 0) {

            petsContainer.innerHTML = `

                <p>No Pets Found</p>

            `;

            return;

        }

        data.pets.forEach(pet => {

            petsContainer.innerHTML += `

                <div class="pet-card">

                    <h5>${pet.petName}</h5>

                    <p><strong>Owner:</strong> ${pet.owner.name}</p>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deletePet('${pet._id}')">

                        Delete Pet

                    </button>

                </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Delete User
// ==========================================

async function deleteUser(id) {

    const confirmDelete = confirm("Delete this user?");

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await fetch(`${BASE_URL}/admin/users/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        alert(data.message);

        loadDashboard();
        loadUsers();

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Delete Pet
// ==========================================

async function deletePet(id) {

    const confirmDelete = confirm("Delete this pet?");

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await fetch(`${BASE_URL}/admin/pets/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        alert(data.message);

        loadDashboard();
        loadPets();

    }

    catch (error) {

        console.log(error);

    }

}