// ================================
// Get Data From Local Storage
// ================================

const token = localStorage.getItem("token");

const user = JSON.parse(
    localStorage.getItem("user")
);

// ================================
// Route Protection
// ================================

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "login.html";

}

// ================================
// Display User Information
// ================================

document.getElementById("userName").textContent =
    user.name;

document.getElementById("profileEmail").textContent =
    user.email;

// ================================
// Logout
// ================================

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logoutUser);

function logoutUser() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {

        return;

    }

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    alert("Logout Successful.");

    window.location.href = "login.html";

}