const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ FIXED MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// Models
const Book = mongoose.model("Book", new mongoose.Schema({
    title: String,
    author: String,
    stock: Number
}));

const Student = mongoose.model("Student", new mongoose.Schema({
    studentId: String,
    name: String
}));

const Issued = mongoose.model("Issued", new mongoose.Schema({
    studentId: String,
    bookId: String,
    issueDate: Date
}));

// Routes
// Routes

// ✅ Root route (add here)
app.get("/", (req, res) => {
    res.send("Library API is running 🚀");
});

app.get("/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

app.post("/books", async (req, res) => {
    const book = await Book.create(req.body);
    res.json({ message: "Book added successfully", book });
});

app.post("/students", async (req, res) => {
    await Student.create(req.body);
    res.json({ message: "Student added" });
});

app.post("/issue", async (req, res) => {
    const { studentId, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.stock <= 0)
        return res.json({ message: "Book not available" });

    book.stock -= 1;
    await book.save();

    await Issued.create({
        studentId,
        bookId,
        issueDate: new Date()
    });

    res.json({ message: "Book issued successfully" });
});

app.post("/return", async (req, res) => {
    const { studentId, bookId } = req.body;

    const issued = await Issued.findOne({ studentId, bookId });
    if (!issued) return res.json({ message: "This book is not issued" });

    await Issued.deleteOne({ _id: issued._id });

    const book = await Book.findById(bookId);
    book.stock += 1;
    await book.save();

    res.json({ message: "Book returned successfully" });
});

// ✅ PORT FIX FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));