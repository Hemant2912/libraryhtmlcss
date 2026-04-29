// 🔒 Check login first
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("returnForm").onsubmit = async (e) => {
    e.preventDefault();

    const bookId = document.getElementById("returnBookId").value.trim();
    const studentId = document.getElementById("returnStudentId").value.trim();

    const res = await fetch("https://libraryhtmlcss.onrender.com/return", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ bookId, studentId })
    });

    const data = await res.json();

    // ❗ Handle invalid token
    if (data.message === "Invalid token" || data.message === "No token") {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("returnMsg").textContent = data.message;
};