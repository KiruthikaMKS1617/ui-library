import { activateFocusTrap, deactivateFocusTrap } from "../global/focusTrap.js";

const setupNav = () => {
  const nav = document.querySelector(".nav");
  const toggleBtn = nav?.querySelector(".nav__toggle");
  const srOnlyNavStatus = document.getElementById("nav-status");

  if (!nav || !toggleBtn) return;

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
    if (isOpen) activateFocusTrap(nav);
    else {
      if (returnFocus) toggleBtn.focus();
      deactivateFocusTrap(nav);
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
