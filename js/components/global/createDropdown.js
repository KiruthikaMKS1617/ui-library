export function createDropdown(dropdown) {
  if (!dropdown) return;

  const trigger = dropdown.querySelector(".dropdown__trigger");
  const menu = dropdown.querySelector(".dropdown__menu");
  if (!trigger || !menu) return;

  const menuItems = [...menu.querySelectorAll(".dropdown__item")];

  /* ---------- STATE (PRIVATE) ---------- */
  let isOpen = false;

  /* ---------- Handlers ---------- */

  function handleKeydown(e) {
    if (!isOpen) return;

    const currIndex = menuItems.indexOf(e.target);
    const len = menuItems.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        menuItems[(currIndex + 1) % len]?.focus();
        break;

      case "ArrowUp":
        e.preventDefault();
        menuItems[(currIndex - 1 + len) % len]?.focus();
        break;

      case "Escape":
        close();
        break;
    }
  }

  function handleMenuItemClick(e) {
    if (e.target.classList.contains("dropdown__item")) {
      close();
    }
  }

  function handleOutsideClick(e) {
    if (!dropdown.contains(e.target)) {
      close();
    }
  }

  /* ---------- Behaviour ---------- */

  function open() {
    if (isOpen) return;
    isOpen = true;

    dropdown.dataset.open = "true";
    trigger.setAttribute("aria-expanded", "true");

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleOutsideClick);
    menu.addEventListener("click", handleMenuItemClick);

    menuItems[0]?.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    dropdown.dataset.open = "false";
    trigger.setAttribute("aria-expanded", "false");

    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("click", handleOutsideClick);
    menu.removeEventListener("click", handleMenuItemClick);

    trigger.focus();
  }

  function toggle(e) {
    e?.stopPropagation();
    isOpen ? close() : open();
  }

  /* ---------- Init ---------- */

  trigger.addEventListener("click", toggle);

  /* ---------- PUBLIC API ---------- */
  return {
    open,
    close,
    toggle,
    destroy() {
      // used at element removal time from ui
      close();
      trigger.removeEventListener("click", toggle);
    },
  };
}
