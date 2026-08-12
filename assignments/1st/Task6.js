// Task 6

for (let i = 1; i <= 30; i++) {
  output = "";
  if (i % 3 == 0) output += "Fizz";
  if (i % 5 == 0) output += "Buzz";
  console.log(output || i);
}
