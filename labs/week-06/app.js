const express = require("express");
const app = express();

app.use(express.static("public"));

app.use(express.json());
const studentsRouter = require("./routes/students.route");
app.use("/students", studentsRouter);

app.listen(3000, () => console.log("http://localhost:3000"));
