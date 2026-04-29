// 🔒 Check login first
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;

    const response = await fetch("https://libraryhtmlcss.onrender.com/students", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ studentId, name })
    });

    const data = await response.json();

    // ❗ Handle invalid token
    if (data.message === "Invalid token" || data.message === "No token") {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("message").textContent = data.message;
});