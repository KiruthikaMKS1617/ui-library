export const createTab = ({ root }) => {
  if (!root) return;

  const tablist = root.querySelector('[role="tablist"]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];

  if (!tablist || !tabs.length || !panels.length) return;

  // ------- CORE TAB BEHAVIOUR --------

  function activateTab(newTab, { focus = true } = {}) {
    if (!newTab) return;
    tabs.forEach((tab) => {
      const selected = tab === newTab;

      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;

      const panelId = tab.getAttribute("aria-controls");
      const panel = root.querySelector(`#${panelId}`);
      if (panel) panel.hidden = !selected;
    });

    if (focus) newTab.focus();
  }

  // ----------- MOUSE CLICK HANDLER ------------
  function handleTabClick(e) {
    const newTab = e.target.closest('[role="tab"]');
    if (!newTab) return;

    e.preventDefault(); // safe guard for button/link tabs --- click.preventDefault() stops navigation, mousedown.preventDefault() blocks.
    activateTab(newTab, { focus: false });
  }

  // ----------- KEYDOWN HANDLER --------
  function handleKeyDown(e) {
    const currentTab = e.target.closest('[role="tab"]');
    if (!currentTab) return;
    const currentIndex = tabs.indexOf(currentTab);
    let nextIndex = null;

    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowDown":
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const nextTab = tabs.at(nextIndex);
    activateTab(nextTab);
  }

  // ------- setting INITIAL TAB based on html data also enforcing rule that only one tab must be selected/active - which in case fixes if 1+ has selected set to true-------
  const initialTab =
    tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];

  activateTab(initialTab, { focus: false });

  // -------- ADD LISTENERS (Persistent Listeners as tabs are active for the page lifetime) ----------
  tablist.addEventListener("click", handleTabClick);
  tablist.addEventListener("keydown", handleKeyDown);

  function destroy() {
    tablist.removeEventListener("click", handleTabClick);
    tablist.removeEventListener("keydown", handleKeyDown);
  }

  // ------  PUBLIC API's ---------
  return {
    activateTab,
    destroy,
  };
};
