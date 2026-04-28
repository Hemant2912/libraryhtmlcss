document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;

    const response = await fetch("https://libraryhtmlcss.onrender.com/students", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ studentId, name })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message;
});