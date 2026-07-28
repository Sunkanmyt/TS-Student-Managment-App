const express = require("express");
const { connectToDb, getDb } = require("./db.js");
const { ObjectId } = require("mongodb");

// Initialize app and middleware
const app = express();
app.use(express.json());

// Connect to Database
const PORT = 3000;
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    db = getDb();
  }
});

// In memory database, basically a JS Array
students = [
  { id: 1, name: "Bayo Olatunde", age: 19, present: true },
  { id: 2, name: "Matthew Bankole", age: 17, present: false },
  { id: 3, name: "Olasunkanmi Oguntoyinbo", age: 4, present: true },
];

//Get books
app.get("/books", async (req, res) => {
  const page = req.query.page || 0;
  const booksPerPage = 5;

  try {
    const books = await db
      .collection("books")
      .find()
      .sort({ name: 1 })
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .toArray();
    if (!books) {
      res.status(404).json({ msg: "No books found" });
    }

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ msg: "Could not fetch documents" });
  }
});

// Get book
app.get("/books/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid doc Id" });
    }

    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch documents" });
  }
});

// Add Book
app.post("/books", (req, res) => {
  const newBook = req.body;

  db.collection("books")
    .insertOne(newBook)
    .then((result) => {
      res.status(201).json(result);
    });
  // .catch((err) => {
  //   res.status(500).json({ error: "Could not create a new document" });
  // });
});

// Delete Book
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid Document Id" });
  }

  db.collection("books")
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      if (!result.deletedCount) {
        return res.status(404).json({ msg: "Book not found" });
      }

      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not delete the document" });
    });
});

// Update Book
app.patch("/books/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid Document Id" });
  }

  db.collection("books")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates })
    .then((result) => {
      if (!result.matchedCount) {
        return res.status(404).json({ msg: "Book not found" });
      }

      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ msg: "Could not update the document" });
    });
});
//
//
//
// THIS IS THE MAIN CLASSWORK. EVERYTHING ABOVE IS JUST PRACTISE
// Add Student
app.post("/students", (req, res) => {
  const { name, age } = req.body;

  newStudent = {
    id: Date.now(),
    name,
    age,
    present: false,
  };

  students.push(newStudent);

  res.status(201).json(students);
});

// Fetch Students
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// Fetch student
app.get("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id);

  const student = students.find((student) => student.id === studentId);

  if (!student) {
    res.status(404).json({
      message: "Student not found",
    });
  }

  res.status(200).json(student);
});

// Update Student
app.put("/students/:id", (req, res) => {
  const { name, age, present } = req.body;
  const studentId = parseInt(req.params.id);

  const studentIndex = students.findIndex(
    (student) => student.id === studentId,
  );

  const updatedStudent = {
    id: Date.now(),
    name,
    age,
    present,
  };

  students[studentIndex] = updatedStudent;
  res.status(201).json(students);
});

// Delete Student
app.delete("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id);

  const studentIndex = students.findIndex(
    (student) => student.id === studentId,
  );

  if (studentIndex === -1) {
    res.status(404).json({
      message: "Student not found",
    });
  }

  const [deletedStudent] = students.splice(studentIndex, 1);
  res.json(deletedStudent);
});

// Route handler
// app.delete("/students/:id", async (req, res) => {
//   try {
//     const studentId = req.params.id;

//     if (!ObjectId.isValid(studentId)) {
//       return app.status(400).json({ msg: "Invalid Id" });
//     }

//     const books = await db
//       .collection("students")
//       .deleteOne({ _id: new ObjectId(id) });

//     if (!books) {
//       app.status(404).json({ msg: "Books not found" });
//     }

//     console.log("Student successfully removed");
//     app.status(200).json(books);
//   } catch (err) {
//     app.status(500).json({ msg: "Unable to fetch books" });
//   }
// });
