// Task 3

function getScore(score) {
  // body
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";

  return "F";
}
console.log(getScore(95));
console.log(getScore(75));
console.log(getScore(65));
console.log(getScore(40));
