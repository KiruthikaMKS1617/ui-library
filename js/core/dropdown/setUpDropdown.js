const setUpDropdown = () => {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown) return;

  const trigger = dropdown.querySelector(".dropdown__trigger");
  const menu = dropdown.querySelector(".dropdown__menu");

  function open() {
    dropdown.dataset.open = "true";
  }

  function close() {
    dropdown.dataset.open = "false";
  }

  function toggle() {
    const isOpen = dropdown.dataset.open === "true";
    isOpen ? close() : open();
  }

  /* --- Trigger click --- */
  trigger.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent outside click close
    toggle();
  });

  /* --- Outside click --- */
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      close();
    }
  });
};

export default setUpDropdown;
