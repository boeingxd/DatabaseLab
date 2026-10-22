// public/main.js
//
// Exercise 3: fill in the three TODOs below. index.html and style.css are
// already done -- this file is the actual exercise.
const list = document.getElementById("list");
const form = document.getElementById("form");
const nameInput = form.elements["name"];
const majorInput = form.elements["major"];
const yearInput = form.elements["year"];
const message = document.getElementById("message");

// TODO 1: fetch('/students'), turn the JSON response into an array of
// students, and set list.innerHTML to one <li> per student (name, major,
// and a delete <button data-id="..."> like the one used below).
async function load() {
  const res = await fetch("/students");
  const students = await res.json();
  list.innerHTML = students
    .map(
      (s) =>
        `<li>${s.name} - ${s.major} <button data-id="${s.id}">Delete</button></li>`,
    )
    .join("");
}

// TODO 2: on submit, prevent the default page reload, POST the form's
// values as JSON to /students, then call load() again to refresh the list.
// (Exercise 4: if the response isn't ok, show the server's error message
// in #message instead.)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value,
      major: majorInput.value,
      year: Number(yearInput.value),
    }),
  });
  if (!res.ok) {
    const { error } = await res.json();
    message.textContent = error;
    return;
  }
  message.textContent = "";
  form.reset();
  load();
});

// TODO 3: when a delete button inside #list is clicked, send a DELETE
// request to /students/<that button's data-id>, then call load() again.
list.addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const res = await fetch(`/students/${e.target.dataset.id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const { error } = await res.json();
    message.textContent = error;
    return;
  }
  message.textContent = "";
  load();
});

load();
