export function debounce(fn, delay = 300) {
  let timer;

  return function (...args) {
    // rest operator to capture all arguments passed to the debounced function and store them in an array called args - in our case with createFormValidator.js - it receives event
    clearTimeout(timer);

    timer = setTimeout(() => fn(...args), delay);
  };
}

