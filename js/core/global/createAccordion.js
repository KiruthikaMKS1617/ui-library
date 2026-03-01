export const createAccordion = ({ root }) => {
  if (!root) return;
  const triggers = [...root.querySelectorAll(".accordion__trigger")];

  if (!triggers.length) return;

  function toggleAccordion(trigger) {
    if (!trigger) return;

    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    const panelId = trigger.getAttribute("aria-controls");
    const panel = root.querySelector(`#${panelId}`);
    if (!panel) return;

    /* =========================
     SINGLE OPEN MODE
     ========================= */
    if (!isOpen) {
      // if the event triggered panel is closed currently. before opening this we need to close the already opened one.
      triggers.forEach((btn) => {
        if (btn === trigger) return;

        if (btn.getAttribute("aria-expanded") === "true") {
          toggleAccordion(btn); // reuse same logic
        }
      });
    }
    // Click B
    // │
    // ├─ close A (function call)
    // │     └─ animation scheduled (async)
    // │
    // └─ continue same function
    //       └─ open B

    /* =========================
     TOGGLE CURRENT
     ========================= */

    trigger.setAttribute("aria-expanded", String(!isOpen));

    if (isOpen) {
      // ---- CLOSE ----
      panel.setAttribute("aria-open", "false");

      panel.addEventListener(
        "transitionend",
        (e) => {
          // guard clause → ignore children transitions if any
          if (e.target !== panel) return;
          // guard clause → ignore padding transition
          if (e.propertyName !== "grid-template-rows") return;

          panel.hidden = true;
        },
        { once: true },
      );
    } else {
      // ---- OPEN ----
      panel.hidden = false;

      // allow browser to paint closed state first
      requestAnimationFrame(() => {
        panel.setAttribute("aria-open", "true");
      });
    }
  }

  function handleTriggerClick(e) {
    const accordionTrigger = e.target.closest(".accordion__trigger");
    if (!accordionTrigger) return;
    if (!root.contains(accordionTrigger)) return;
    toggleAccordion(accordionTrigger);
  }

  function handleKeyDown(e) {
    const trigger = e.target.closest(".accordion__trigger");
    if (!trigger || !root.contains(trigger)) return;

    const currIndex = triggers.indexOf(trigger);
    if (currIndex === -1) return;
    let nextIndex = null;

    switch (e.key) {
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = triggers.length - 1;
        break;
      case "ArrowDown":
        nextIndex = (currIndex + 1) % triggers.length;
        break;
      case "ArrowUp":
        nextIndex = (currIndex - 1 + triggers.length) % triggers.length;
        break;
      default:
        return;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      triggers.at(nextIndex).focus();
      return;
    }

    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.key === " ") e.preventDefault();
    toggleAccordion(trigger);
  }

  root.addEventListener("click", handleTriggerClick);
  root.addEventListener("keydown", handleKeyDown);

  function destroy() {
    root.removeEventListener("click", handleTriggerClick);
    root.removeEventListener("keydown", handleKeyDown);
  }

  return {
    toggleAccordion,
    destroy,
  };
};

// Browser paints ~60 FPS (~16ms/frame).

// CSS transitions run only when style changes occur across
// separate paint frames.

// hidden=false creates initial rendered layout.

// requestAnimationFrame moves the next change to the next frame,
// allowing the browser to detect a layout difference and animate it.

// rAF is render synchronization, not a delay.
