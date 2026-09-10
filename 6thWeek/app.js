const express = require("express");
const app = express();

app.use(express.json());
const studentsRouter = require("./routes/students.route");
app.use("/students", studentsRouter);
