const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", loginUser);

async function loginUser(event) {

    event.preventDefault();

    message.innerHTML = "";

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${BASE_URL}/auth/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({

                email,
                password,

            }),

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

        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        message.innerHTML = `
            <p class="text-success">
                Login Successful...
            </p>
        `;

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1000);

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