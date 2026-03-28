const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/librarydb")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// Book Model
const Book = mongoose.model("Book", new mongoose.Schema({
    title: String,
    author: String,
    stock: Number
}));

// Student Model
const Student = mongoose.model("Student", new mongoose.Schema({
    studentId: String,
    name: String
}));

// Issue Book Model
const Issued = mongoose.model("Issued", new mongoose.Schema({
    studentId: String,
    bookId: String,
    issueDate: Date
}));

// ---------------------- API ROUTES ----------------------

// View all books
app.get("/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// Add book
app.post("/books", async (req, res) => {
    const book = await Book.create(req.body);
    res.json({ message: "Book added successfully", book });
});

// Add student
app.post("/students", async (req, res) => {
    await Student.create(req.body);
    res.json({ message: "Student added" });
});

// Issue book
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

// Return book
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

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
