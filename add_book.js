// 🔒 Check login first
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("bookForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const stock = Number(document.getElementById("stock").value);

    const response = await fetch("https://libraryhtmlcss.onrender.com/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title, author, stock })
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