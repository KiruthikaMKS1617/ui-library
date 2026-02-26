import { createTab } from "../global/createTab.js";
const setUpTabs = () => {
  const tabRoots = document.querySelectorAll("[data-tabs]");
  tabRoots.forEach((tabRoot) => createTab({ root: tabRoot }));
};

export default setUpTabs;
