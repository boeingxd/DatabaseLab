let students = [];

function addStudents(id, name, year) {
  students.push({ id, name, year });
}

function listAll() {
  // body
  students.forEach((s) => {
    console.log(`ID: ${s.id}, Name: ${s.name}, Year: ${s.year}`);
  });
}

function removeByID(id) {
  // body
  students = students.filter((obj_stu) => obj_stu.id !== id);
}

addStudents(1, "Pearl", 2);
addStudents(2, "Perl", 3);
addStudents(3, "Purl", 3.5);
removeByID(1);
listAll();
