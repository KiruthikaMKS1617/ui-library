import { createFocusTrap } from "../global/createFocusTrap.js";

const setupNav = () => {
  const nav = document.querySelector(".nav");
  const toggleBtn = nav?.querySelector(".nav__toggle");
  const srOnlyNavStatus = document.getElementById("nav-status");

  if (!nav || !toggleBtn) return;

  const trap = createFocusTrap(nav);

  // Toggle Nav
  const toggleNav = ({ isOpen, returnFocus = false }) => {
    const isCurrentlyOpen = nav.classList.contains("nav--open");
    if (isCurrentlyOpen === isOpen) return;

    nav.classList.toggle("nav--open", isOpen);
    toggleBtn.setAttribute("aria-expanded", isOpen);
    toggleBtn.setAttribute("aria-label", isOpen ? "Close Menu" : "Open Menu");
    document.body.style.overflow = isOpen ? "hidden" : "";

    if (srOnlyNavStatus)
      srOnlyNavStatus.textContent = isOpen
        ? "Navigation Menu Opened"
        : "Navigation Menu Closed";

    if (isOpen) trap.activate(nav);
    else {
      if (returnFocus) toggleBtn.focus();
      trap.deactivate(nav);
    }
  };

  // Toggle button click
  toggleBtn.addEventListener("click", () =>
    toggleNav({ isOpen: !nav.classList.contains("nav--open") }),
  );

  // ESC key closes nav
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav--open"))
      toggleNav({ isOpen: false, returnFocus: true });
  });

  // Document click - outside nav & link click
  document.addEventListener("click", (e) => {
    // Now imagine what happens without this guard --- if (!nav.classList.contains("nav--open")) return;👇

    // When you click toggle:

    // 1️⃣ Toggle button listener runs
    // 2️⃣ Event bubbles up to document
    // 3️⃣ Document click listener runs
    // 4️⃣ Document logic sees "outside nav"
    // 5️⃣ It closes nav again

    // Result?

    // Open → immediately close.

    // Bug.
    if (!nav.classList.contains("nav--open")) return;
    const clickedLink = e.target.closest(".nav__link");
    const clickedToggle = toggleBtn.contains(e.target);

    // 1️⃣ Click toggle → ignore
    if (clickedToggle) return;

    // 2️⃣ Click link inside nav → close nav || Click outside nav → close nav
    if (clickedLink || !nav.contains(e.target)) toggleNav({ isOpen: false });
  });
};

export default setupNav;
