import { createFocusTrap } from "./createFocusTrap.js";

export const createModal = ({ openBtns, closeBtn, modal, overlay }) => {
  const triggers = [...openBtns];

  if (!triggers.length || !closeBtn || !modal || !overlay) return;

  let isOpen = false; // as modal not opened yet as per behaviour
  let lastTrigger = null;
  const trap = createFocusTrap({ container: modal });

  function openModal(e) {
    if (isOpen) return;
    isOpen = true;
    modal.hidden = !isOpen;
    lastTrigger = e?.currentTarget;

    [overlay, closeBtn].forEach((el) =>
      el.addEventListener("click", closeModal),
    );
    document.addEventListener("keydown", handleEsc);

    const focusabeEls = [
      ...modal.querySelectorAll(
        '[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    ];

    requestAnimationFrame(() => {
      trap.activate();
      const initialFocusEl =
        modal.querySelector("[data-initial-focus]") || focusabeEls.at(0);
      initialFocusEl?.focus();
    });
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;
    modal.hidden = !isOpen;

    trap.deactivate();
    lastTrigger?.focus();

    [overlay, closeBtn].forEach((el) =>
      el.removeEventListener("click", closeModal),
    );
    document.removeEventListener("keydown", handleEsc);
  }

  function handleEsc(e) {
    if (e.key !== "Escape") return;
    if (!isOpen) return;
    closeModal();
  }

  function destroy() {
    if (isOpen) closeModal();

    // cleanup must, eventhough modal is not open
    triggers.forEach((btn) => btn.removeEventListener("click", openModal));
  }

  triggers.forEach((btn) => btn.addEventListener("click", openModal));

  // public api's for handling programmatically w/o user involvement for modal actions. eg: clicking on dropdown action will trigger modal open
  return {
    openModal,
    closeModal,
    destroy,
  };
};

// ✅ 1️⃣ Why JS state starts with isOpen = false

// You said:

// modal will be closed by default and open handler will be tracked within its behaviour right?

// Yes — but the real reason is slightly deeper.

// 🧠 JS state is not describing DOM.

// It is describing behaviour lifecycle.

// At factory creation time:

// createModal(...)

// the modal instance is born.

// At that moment:

// modal is not controlling interaction

// listeners are not attached

// focus trap inactive

// So behaviourally:

// isOpen = false

// Even if someone accidentally removes hidden from HTML, your component still knows:

// “I am not active yet.”

// 🔥 Important Principle

// JS state represents behaviour truth, not visual truth.

// DOM may lie temporarily.
// JS state must never lie.

// That’s why we initialize explicitly.

// Timeline View
// Factory created
//    ↓
// Component inactive
//    ↓
// isOpen = false
//    ↓
// User clicks trigger
//    ↓
// open() → isOpen = true

// So yes — open handler tracks lifecycle, but JS state is the authority.
