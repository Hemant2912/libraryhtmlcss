document.getElementById("bookForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const stock = Number(document.getElementById("stock").value);

    const response = await fetch("https://libraryhtmlcss.onrender.com/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, author, stock })
    });

    const data = await response.json();

    document.getElementById("message").textContent = data.message;
});