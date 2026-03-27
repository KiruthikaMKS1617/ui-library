import { throttle } from "../utils/throttle.js";

export default function scrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (!scrollIndicator) return;

  const updateScrollIndicator = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollIndicator.style.width = `${scrollPercent}%`;
  };

  window.addEventListener("scroll", throttle(updateScrollIndicator, 100));
}
