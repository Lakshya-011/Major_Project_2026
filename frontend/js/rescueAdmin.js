
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const container = document.getElementById("reportsContainer");
    const message = document.getElementById("message");
    const refreshBtn = document.getElementById("refreshBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const statuses = [
        "Pending",
        "Assigned",
        "Rescue in Progress",
        "Rescued",
        "Completed",
        "Rejected"
    ];

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
        message.classList.remove("d-none");
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

    function formatDate(date) {
        if (!date) return "Not available";

        const parsed = new Date(date);
        return Number.isNaN(parsed.getTime())
            ? "Not available"
            : parsed.toLocaleString("en-IN");
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

    function getReports(data) {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.reports)) return data.reports;
        if (Array.isArray(data.data)) return data.data;
        return [];
    }

    function updateStatistics(reports) {
        document.getElementById("totalCount").textContent = reports.length;
        document.getElementById("pendingCount").textContent =
            reports.filter(report => report.status === "Pending").length;
        document.getElementById("progressCount").textContent =
            reports.filter(report => report.status === "Rescue in Progress").length;
        document.getElementById("completedCount").textContent =
            reports.filter(report =>
                ["Rescued", "Completed"].includes(report.status)
            ).length;
    }

    function renderReports(reports) {
        container.innerHTML = "";
        updateStatistics(reports);

        if (!reports.length) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="fa-solid fa-inbox fa-3x mb-3"></i>
                        <h4>No Rescue Reports Found</h4>
                        <p>New reports will appear here.</p>
                    </div>
                </div>
            `;
            return;
        }

        reports.forEach(report => {
            const card = document.createElement("div");
            card.className = "col-12";

            const imageUrl = report.image?.url || "";
            const location = report.location?.address || "Not provided";
            const reporterName =
                report.reporter?.name ||
                report.contactName ||
                "Not available";
            const reporterEmail = report.reporter?.email || "Not available";
            const reporterPhone =
                report.contactPhone || "Not provided";
            const assignedId =
                report.assignedVolunteer?._id ||
                report.assignedVolunteer ||
                "";

            const statusOptions = statuses.map(status => `
                <option value="${status}" ${report.status === status ? "selected" : ""}>
                    ${status}
                </option>
            `).join("");

            card.innerHTML = `
                <div class="report-card">
                    <div class="row g-0">
                        <div class="col-lg-4">
                            ${
                                imageUrl
                                    ? `<img src="${escapeHTML(imageUrl)}" class="report-image" alt="Reported animal">`
                                    : `<div class="image-placeholder">No Image Uploaded</div>`
                            }
                        </div>

                        <div class="col-lg-8">
                            <div class="report-content">
                                <div class="d-flex justify-content-between flex-wrap gap-2 mb-3">
                                    <h4>${escapeHTML(report.animalType || "Animal")}</h4>
                                    <span class="status-badge ${getStatusClass(report.status)}">
                                        ${escapeHTML(report.status || "Pending")}
                                    </span>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Condition:</strong> ${escapeHTML(report.condition)}</p>
                                        <p><strong>Urgency:</strong> ${escapeHTML(report.urgency)}</p>
                                        <p><strong>Reporter:</strong> ${escapeHTML(reporterName)}</p>
                                        <p><strong>Email:</strong> ${escapeHTML(reporterEmail)}</p>
                                        <p><strong>Contact:</strong> ${escapeHTML(reporterPhone)}</p>
                                    </div>

                                    <div class="col-md-6">
                                        <p><strong>Location:</strong> ${escapeHTML(location)}</p>
                                        <p><strong>Reported:</strong> ${formatDate(report.createdAt)}</p>
                                        <p><strong>Latitude:</strong> ${escapeHTML(report.location?.latitude ?? "Not provided")}</p>
                                        <p><strong>Longitude:</strong> ${escapeHTML(report.location?.longitude ?? "Not provided")}</p>
                                        ${
                                            report.location?.latitude != null &&
                                            report.location?.longitude != null
                                                ? `<a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps?q=${encodeURIComponent(report.location.latitude)},${encodeURIComponent(report.location.longitude)}">Open in Google Maps</a>`
                                                : ""
                                        }
                                    </div>
                                </div>

                                <p><strong>Description:</strong> ${escapeHTML(report.description)}</p>

                                <hr>

                                <form class="update-rescue-form" data-id="${escapeHTML(report._id)}">
                                    <div class="row g-3">
                                        <div class="col-md-5">
                                            <label class="form-label">Update Status</label>
                                            <select name="status" class="form-select">
                                                ${statusOptions}
                                            </select>
                                        </div>

                                        <div class="col-md-7">
                                            <label class="form-label">Volunteer User ID</label>
                                            <input
                                                type="text"
                                                name="assignedVolunteer"
                                                class="form-control"
                                                placeholder="Enter volunteer's MongoDB User ID"
                                                value="${escapeHTML(assignedId)}">
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label">Rescue Notes</label>
                                            <textarea
                                                name="rescueNotes"
                                                class="form-control"
                                                rows="2"
                                                placeholder="Add rescue progress or notes...">${escapeHTML(report.rescueNotes || "")}</textarea>
                                        </div>

                                        <div class="col-12">
                                            <button type="submit" class="btn btn-success">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                                Save Updates
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    async function loadReports() {
        refreshBtn.disabled = true;
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="spinner-border text-success"></div>
                <p class="mt-2">Loading rescue reports...</p>
            </div>
        `;

        try {
            const response = await fetch(`${BASE_URL}/rescues`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load reports.");
            }

            renderReports(getReports(data));
            message.classList.add("d-none");

        } catch (error) {
            container.innerHTML = "";
            showMessage(error.message);
        } finally {
            refreshBtn.disabled = false;
        }
    }

    container.addEventListener("submit", async event => {
        const form = event.target.closest(".update-rescue-form");
        if (!form) return;

        event.preventDefault();

        const reportId = form.dataset.id;
        const submitButton = form.querySelector('button[type="submit"]');
        const volunteerId = form.elements.assignedVolunteer.value.trim();

        const payload = {
            status: form.elements.status.value,
            rescueNotes: form.elements.rescueNotes.value.trim()
        };

        if (volunteerId) {
            payload.assignedVolunteer = volunteerId;
        } else {
            payload.assignedVolunteer = null;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Saving...";

            const response = await fetch(
                `${BASE_URL}/rescues/${encodeURIComponent(reportId)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update report.");
            }

            showMessage("Rescue report updated successfully.", "success");
            await loadReports();

        } catch (error) {
            showMessage(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Save Updates
            `;
        }
    });

    refreshBtn.addEventListener("click", loadReports);

    loadReports();
});
