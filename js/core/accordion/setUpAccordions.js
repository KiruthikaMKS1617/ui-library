import { createAccordion } from "../global/createAccordion.js";
const setUpAccordions = () => {
  const accordionRoots = document.querySelectorAll("[data-accordion]");
  if (!accordionRoots.length) return;

  accordionRoots.forEach((root) => createAccordion({ root }));
};

export default setUpAccordions;
