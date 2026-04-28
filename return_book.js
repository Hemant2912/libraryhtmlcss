document.getElementById("returnForm").onsubmit = async (e) => {
    e.preventDefault();

    const bookId = document.getElementById("returnBookId").value.trim();
    const studentId = document.getElementById("returnStudentId").value.trim();

    const res = await fetch("https://libraryhtmlcss.onrender.com/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId })
    });

    const data = await res.json();
    document.getElementById("returnMsg").textContent = data.message;
};