document.getElementById("issueForm").onsubmit = async (e) => {
    e.preventDefault();

    const bookId = document.getElementById("issueBookId").value.trim();
    const studentId = document.getElementById("issueStudentId").value.trim();

    const res = await fetch("https://libraryhtmlcss.onrender.com/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId })
    });

    const data = await res.json();
    document.getElementById("issueMsg").textContent = data.message;
};