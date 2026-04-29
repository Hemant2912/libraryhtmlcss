// 🔒 If already logged in, skip login page
if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("https://libraryhtmlcss.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            document.getElementById("msg").textContent = data.message;
        }

    } catch (error) {
        document.getElementById("msg").textContent = "Server error. Try again.";
    }
});