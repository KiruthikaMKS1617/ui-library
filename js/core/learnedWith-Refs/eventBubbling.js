const eventBubbling = () => {
  const header = document.querySelector("header");
  if (!header) return;

  const outer = document.querySelector(".outer");
  const middle = document.querySelector(".middle");
  const inner = document.querySelector(".inner");

  outer.addEventListener("click", (e) => {
    console.log("Clicked:", e.currentTarget.className); // e.currentTarget - The element whose listener is currently running. Changes at each level.
    console.log("Actual target:", e.target.className); // e.target - Always the element that was actually clicked. Never changes during bubbling.
    console.log("----- 1");
  });
  middle.addEventListener("click", (e) => {
    console.log("Clicked:", e.currentTarget.className);
    console.log("Actual target:", e.target.className);
    console.log("----- 2");
  });
  inner.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Clicked:", e.currentTarget.className);
    console.log("Actual target:", e.target.className);
    console.log("----- 3");
  });
};

export default eventBubbling;
