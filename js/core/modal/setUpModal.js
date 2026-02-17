import { createFocusTrap } from "../global/createFocusTrap.js";

const setUpModal = () => {
  let lastTrigger = null;
  const openBtn = document.querySelector("[data-modal]");
  const modal = document.querySelector(".modal");

  if (!openBtn || !modal) return;

  const trap = createFocusTrap(modal);

  const overlay = modal.querySelector(".modal__overlay");
  const closeBtn = modal.querySelector(".modal__close");

  const openModal = () => {
    modal.hidden = false;
    const focusableElements = [
      ...modal.querySelectorAll(
        'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])',
      ),
    ];

    requestAnimationFrame(() => {
      trap.activate(modal); // If focus fires first and user presses Tab very fast, trap may not yet be active. hence activate before setting custom focus.

      const initialFocusEl =
        modal.querySelector("[data-initial-focus]") || focusableElements[0];
      initialFocusEl.focus();
    });
  };
  const closeModal = () => {
    modal.hidden = true;
    trap.deactivate(modal);
    if (lastTrigger) lastTrigger.focus();
  };

  openBtn.addEventListener("click", (e) => {
    lastTrigger = e.currentTarget;
    openModal();
  });
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (modal.hidden) return;
    closeModal();
  });
};

export default setUpModal;
