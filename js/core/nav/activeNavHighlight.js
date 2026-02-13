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

  const isMobile = globalThis.matchMedia("(max-width: 768px)").matches;

  const observerOptions = isMobile
    ? { rootMargin: "-25% 0px -25% 0px", threshold: 0.15 }
    : { rootMargin: "0px 0px -50% 0px", threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    if (isHashPriority) return;

    const visibleSections = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) =>
        isMobile
          ? b.boundingClientRect.top - a.boundingClientRect.top
          : a.boundingClientRect.top - b.boundingClientRect.top,
      );

    if (
      !visibleSections.length ||
      !document.getElementById(visibleSections[0].target.id)
    )
      return;

    setActiveLink(visibleSections[0].target.id);
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
};

export default activeNavHighlight;
