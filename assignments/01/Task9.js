// Task 9
function countdown(time) {
  // body
  let t = time;
  const timer = setInterval(() => {
    console.log(t);
    t--;
    if (t < 0) {
      clearInterval(timer);
      console.log("Liftoff!");
    }
  }, 1000);
}

countdown(5);
