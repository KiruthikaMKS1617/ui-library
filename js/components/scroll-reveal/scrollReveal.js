export const createScrollReveal = () => {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  // Group stagger
  const groups = document.querySelectorAll("[data-reveal-group]");
  groups.forEach((group) => {
    const items = group.querySelectorAll("[data-reveal]");

    items.forEach((el, index) => {
      const customDelay = el.dataset.delay;
      const delay = customDelay ? Number.parseFloat(customDelay) : index * 0.08;

      el.style.setProperty("--reveal-delay", `${delay}s`);
    });
  });

  // Fallback for non-group elements
  elements.forEach((el) => {
    const isInGroup = el.closest("[data-reveal-group]");
    if (isInGroup) return;

    const customDelay = el.dataset.delay;
    const delay = customDelay ? Number.parseFloat(customDelay) : 0;

    el.style.setProperty("--reveal-delay", `${delay}s`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const isOnce = el.dataset.once !== "false";
        //undefined !== "false" --- true
        //undefined === "true" --- false
        // so !== "false" case says "apply isOnce only html explicitly says data-once="false" else consider repeat
        // Most real systems 👇
        // Default → once
        // Optional → repeat

        if (entry.isIntersecting) {
          el.classList.add("is-visible");

          el.style.willChange = "auto"; // cleanup

          if (isOnce) {
            obs.unobserve(el);
          }
        } else if (!isOnce) {
          el.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -15% 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
};
