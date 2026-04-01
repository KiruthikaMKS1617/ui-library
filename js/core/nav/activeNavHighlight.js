const activeNavHighlight = () => {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav__link");
  let isHashPriority = false;

  if (!sections.length || !links.length) return;

  const setActiveLink = (id) => {
    links.forEach((link) => {
      link.classList.toggle(
        "nav__link--active",
        link.getAttribute("href") === `#${id}`,
      );
    });
  };

  const applyFromHash = () => {
    const hash = globalThis.location.hash;

    if (!hash) return;
    isHashPriority = true;
    setActiveLink(hash.substring(1));

    setTimeout(() => {
      isHashPriority = false;
    }, 600);
  };

  applyFromHash();
  globalThis.addEventListener("hashchange", applyFromHash);

  const media = matchMedia("(max-width: 768px)");
  let isMobile = media.matches;

  media.addEventListener("change", (e) => {
    isMobile = e.matches;
  });

  const observerOptions = isMobile
    ? { rootMargin: "-25% 0px -25% 0px", threshold: 0.15 }
    : { rootMargin: "0px 0px -50% 0px", threshold: 0.2 };

  const visibleMap = new Map();

  const observer = new IntersectionObserver((entries) => {
    if (isHashPriority) return;

    entries.forEach((entry) => {
      visibleMap.set(entry.target.id, entry.isIntersecting);
    });

    const visibleSections = [...visibleMap.entries()]
      .filter(([_, isVisible]) => isVisible)
      .map(([id]) => document.getElementById(id));

    if (!visibleSections.length) return;

    const sorted = visibleSections.toSorted((a, b) =>
      isMobile
        ? b.getBoundingClientRect().top - a.getBoundingClientRect().top
        : a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );

    setActiveLink(sorted[0].id);
  }, observerOptions);
  sections.forEach((section) => observer.observe(section));
};

export default activeNavHighlight;

// entries = array of sections that have changes in visibility (Eg: from visible to hidden or vice versa)
//“First time → set initial values --- observer runs immediately with the current visibility of all sections first time it is created
// After that → track updates” --- for sections that undergoes visibility changes.
// Eg: visible to hidden and vice versa. Only those sections will be in entries,
//  not all sections. So we update the visibleMap with the current visibility
// status of those sections that are in entries. Hence, we can access all visible
// sections for those whose visibility has changed (with this update)
// and has not changed (from the initial snapshot)
// ********************
// IntersectionObserver = initial snapshot + incremental updates
