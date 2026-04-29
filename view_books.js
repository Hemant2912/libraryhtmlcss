async function loadBooks() {
    const response = await fetch("https://libraryhtmlcss.onrender.com/books");
    const books = await response.json();

    const tableBody = document.getElementById("booksTable");
    tableBody.innerHTML = "";

    books.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book._id.slice(0,6)}...</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.stock}</td>
        `;

        tableBody.appendChild(row);
    });
}

loadBooks();