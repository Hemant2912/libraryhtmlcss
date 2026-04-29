// 🔒 Check login FIRST
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function loadBooks() {
    const response = await fetch("https://libraryhtmlcss.onrender.com/books", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    const books = await response.json();

    // ❗ Handle invalid token
    if (books.message === "Invalid token" || books.message === "No token") {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    const tableBody = document.getElementById("booksTable");
    tableBody.innerHTML = "";

    // ⚠️ If no books
    if (books.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4'>No books found</td></tr>";
        return;
    }

    books.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book._id.slice(0,6)}...${book._id.slice(-4)}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.stock}</td>
        `;

        tableBody.appendChild(row);
    });
}

loadBooks();