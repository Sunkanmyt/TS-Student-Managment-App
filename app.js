const express = require("express");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In memory database, basically a JS Array
students = [
  { id: 1, name: "Bayo Olatunde", age: 19, present: true },
  { id: 2, name: "Matthew Bankole", age: 17, present: false },
  { id: 3, name: "Olasunkanmi Oguntoyinbo", age: 4, present: true },
];

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
  res.json(students);
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

  res.json(student);
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
  res.json(students);
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

// Port configuration
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
