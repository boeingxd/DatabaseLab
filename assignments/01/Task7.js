// Task 7
let books = [
  { title: "How to train your dragon", author: "The dragon", year: "2006" },
  { title: "Dune", author: "The sandworm", year: "1967" },
  {
    title: "How to train your sandworm",
    author: "The Issan-Alghaib",
    year: "6700",
  },
];

console.log("Number of books: " + books.length);
console.log("Second book title: " + books[1].title);
for (let i = 0; i < books.length; i++) {
  console.log(books[i].title + " by " + books[i].author);
}
