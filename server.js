const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ ENV
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

/* ===================== MODELS ===================== */

const Book = mongoose.model("Book", new mongoose.Schema({
    title: String,
    author: String,
    stock: Number,
    userId: String
}));

const Student = mongoose.model("Student", new mongoose.Schema({
    studentId: String,
    name: String,
    userId: String
}));

const Issued = mongoose.model("Issued", new mongoose.Schema({
    studentId: String,
    bookId: String,
    issueDate: Date,
    userId: String
}));

const User = mongoose.model("User", new mongoose.Schema({
    email: String,
    password: String
}));

/* ===================== AUTH ===================== */

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

/* ===================== ROUTES ===================== */

// Root
app.get("/", (req, res) => {
    res.send("Library API is running 🚀");
});

/* ---------- AUTH ROUTES ---------- */

// ✅ FIXED Signup (with error logging)
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "All fields required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword
        });

        res.json({ message: "User created successfully" });

    } catch (err) {
        console.log("🔥 SIGNUP ERROR:", err); // 👈 ADDED
        res.status(500).json({ message: "Server error" });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ message: "Wrong password" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({ message: "Login successful", token });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/* ---------- BOOK ROUTES ---------- */

app.get("/books", auth, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.userId });
        res.json(books);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/books", auth, async (req, res) => {
    try {
        const book = await Book.create({
            ...req.body,
            userId: req.userId
        });

        res.json({ message: "Book added successfully", book });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/* ---------- STUDENT ---------- */

app.post("/students", auth, async (req, res) => {
    try {
        await Student.create({
            ...req.body,
            userId: req.userId
        });

        res.json({ message: "Student added" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/* ---------- ISSUE BOOK ---------- */

app.post("/issue", auth, async (req, res) => {
    try {
        const { studentId, bookId } = req.body;

        const book = await Book.findOne({ _id: bookId, userId: req.userId });
        if (!book || book.stock <= 0)
            return res.json({ message: "Book not available" });

        book.stock -= 1;
        await book.save();

        await Issued.create({
            studentId,
            bookId,
            issueDate: new Date(),
            userId: req.userId
        });

        res.json({ message: "Book issued successfully" });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/* ---------- RETURN BOOK ---------- */

app.post("/return", auth, async (req, res) => {
    try {
        const { studentId, bookId } = req.body;

        const issued = await Issued.findOne({
            studentId,
            bookId,
            userId: req.userId
        });

        if (!issued) return res.json({ message: "This book is not issued" });

        await Issued.deleteOne({ _id: issued._id });

        const book = await Book.findOne({ _id: bookId, userId: req.userId });
        if (book) {
            book.stock += 1;
            await book.save();
        }

        res.json({ message: "Book returned successfully" });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/* ===================== SERVER ===================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));