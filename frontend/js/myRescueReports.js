
document.addEventListener("DOMContentLoaded", () => {
    const reportsContainer = document.getElementById("reportsContainer");
    const message = document.getElementById("message");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });

    function showMessage(text, type = "danger") {
        message.textContent = text;
        message.className = `alert alert-${type}`;
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getStatusClass(status) {
        const classes = {
            "Pending": "status-pending",
            "Assigned": "status-assigned",
            "Rescue in Progress": "status-progress",
            "Rescued": "status-rescued",
            "Completed": "status-completed",
            "Rejected": "status-rejected"
        };

        return classes[status] || "status-pending";
    }

    function formatDate(date) {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function renderReports(reports) {
        reportsContainer.innerHTML = "";

        if (!reports || reports.length === 0) {
            reportsContainer.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <h4>No Rescue Reports Yet</h4>
                        <p>You haven't submitted any animal rescue reports.</p>
                        <a href="report-rescue.html" class="btn btn-success">
                            Report an Animal
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        reports.forEach(report => {
            const status = escapeHTML(report.status || "Pending");
            const image = report.image?.url || "";

            const card = document.createElement("div");
            card.className = "col-md-6 col-lg-4";

            card.innerHTML = `
                <div class="report-card">
                    ${
                        image
                            ? `<img src="${escapeHTML(image)}" class="report-image" alt="Reported animal">`
                            : `<div class="report-image-placeholder">Animal Rescue Report</div>`
                    }

                    <div class="report-content">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="animal-type">
                                ${escapeHTML(report.animalType)}
                            </span>

                            <span class="status-badge ${getStatusClass(report.status)}">
                                ${status}
                            </span>
                        </div>

                        <p><strong>Condition:</strong> ${escapeHTML(report.condition)}</p>
                        <p><strong>Urgency:</strong> ${escapeHTML(report.urgency)}</p>
                        <p><strong>Location:</strong> ${escapeHTML(report.location?.address)}</p>
                        <p><strong>Reported:</strong> ${formatDate(report.createdAt)}</p>

                        <p class="description">
                            ${escapeHTML(report.description)}
                        </p>
                    </div>
                </div>
            `;

            reportsContainer.appendChild(card);
        });
    }

    async function loadReports() {
        try {
            const response = await fetch(`${BASE_URL}/rescues/my-reports`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load reports.");
            }

            const reports = Array.isArray(data)
                ? data
                : data.reports || data.data || [];

            renderReports(reports);

        } catch (error) {
            reportsContainer.innerHTML = "";
            showMessage(error.message);
        }
    }

    loadReports();
});
