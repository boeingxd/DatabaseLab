let students = [];

function addStudent(id, name, age) {
  students.push({ id, name, age });
}
function findByID(id) {
  return students.find((obj_stu) => obj_stu.id === id);
}

addStudent(1, "Boe", 20);
addStudent(2, "Perl", 26);
addStudent(3, "Yayik", 31);
console.log(students);
console.log(findByID(2));

// Part B

function listAll(arguments) {
  console.log(students);
}

function removeByID(id) {
  students = students.filter((obj_stu) => obj_stu.id !== id);
}

removeByID(3);
listAll();
