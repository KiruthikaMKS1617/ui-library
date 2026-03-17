export function throttle(fn, delay = 300) {
  let lastCall = 0;
  let timer;

  const run = (...args) => {
    lastCall = Date.now();
    fn(...args);
  };

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) run(...args);
    else {
      clearTimeout(timer);
      timer = setTimeout(() => run(...args), delay - (now - lastCall));
    }
  };
}

// throttle does this
// tracks lastCall and timer in closure
// when the returned function is called, it checks if enough time has passed since lastCall
// if yes, it calls the function immediately and updates lastCall
// if no, it clears any existing timer and sets a new timer to call the function after the remaining time has passed

// Throttle ensures:

// - Controlled execution frequency
// - Immediate execution if allowed (leading)
// - Otherwise schedules ONE final execution (trailing)
// - Always uses latest arguments
// - Prevents duplicate or stale executions
