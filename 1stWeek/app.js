// Exercise 1
let name = "boeing";
let age = 20;
let isStudent = true;
console.log(name + " is " + age + " (student: " + isStudent + ")");

// Exercise 2
let score = 82;
if (score >= 80) {
  console.log("A");
} else if (score >= 70) {
  console.log("B");
} else if (score >= 50) {
  console.log("C");
} else {
  console.log("F");
}

// Exercise 3
console.log("Part A");
for (let i = 1; i <= 10; i++) {
  console.log(i);
}
console.log("Part B");
let t = 5;
const timer = setInterval(() => {
  console.log(t);
  t--;
  if (t < 0) {
    clearInterval(timer);
    console.log("Times up");
  }
}, 1000);

// Exercise 4

let price = 123;

try {
  console.log(price.toUpperCase());
} catch (err) {
  console.log("Error:", err.message);
}
