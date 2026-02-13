let focusTrapStack = [];
export const activateFocusTrap = (container) => {
  focusTrapStack.push(container);
};

export const deactivateFocusTrap = (container) => {
  focusTrapStack = focusTrapStack.filter((c) => c !== container);
};

document.addEventListener("keydown", (e) => {
  console.log({ e, focusTrapStack });
  if (e.key !== "Tab") return;
  if (focusTrapStack.length === 0) return;
  const container = focusTrapStack.at(-1);
  if (!container) return;

  const focusableElements = [
    ...container.querySelectorAll(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
    ),
  ];

  if (!focusableElements.length) return;

  const first = focusableElements.at(0);
  const last = focusableElements.at(-1);

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
