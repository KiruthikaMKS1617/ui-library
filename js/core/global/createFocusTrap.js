export const createFocusTrap = ({ container }) => {
  let focusableEls = [];
  let firstEl = null;
  let lastEl = null;

  function updateFocusableEls() {
    focusableEls = [
      ...container.querySelectorAll(
        '[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    ];
    if (!focusableEls.length) return;

    firstEl = focusableEls.at(0);
    lastEl = focusableEls.at(-1);
  }

  function handleKeyDown(e) {
    console.log({ e });
    if (e.key !== "Tab") return;
    if (!container) return;
    if (!container.contains(document.activeElement)) return;

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  function activate() {
    updateFocusableEls();
    document.addEventListener("keydown", handleKeyDown);
  }

  function deactivate() {
    document.removeEventListener("keydown", handleKeyDown);
  }

  return {
    activate,
    deactivate,
  };
};
