console.log("Register JS Loaded");

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(`${BASE_URL}/auth/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                name,
                email,
                password,
            }),

        });

        const data = await response.json();

        if (data.success) {

            alert(data.message);

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error("Registration Error:", error);

        alert(error.message);

    }

});