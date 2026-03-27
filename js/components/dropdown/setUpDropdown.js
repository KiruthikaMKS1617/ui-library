import { createDropdown } from "../global/createDropdown.js";

const setUpDropdown = () => {
  const dropdowns = document.querySelectorAll(".dropdown");

  if (!dropdowns.length) return;

  dropdowns.forEach((dropdownEl) => {
    // prevent duplicate initialization
    if (dropdownEl.__dropdownInstance) return;

    const instance = createDropdown(dropdownEl);

    // store reference on element (debugging + safety)
    dropdownEl.__dropdownInstance = instance;
  });
};

export default setUpDropdown;
