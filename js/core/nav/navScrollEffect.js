const navBarScrollEffect = () => {
  const nav = document.querySelector(".nav");
  let isScrollEffectApplied = false;
  if (!nav) return;
  window.addEventListener(
    "scroll",
    () => {
      const isScrollYMoreThan10 = window.scrollY > 10;

      if (isScrollYMoreThan10 === isScrollEffectApplied) return;

      isScrollEffectApplied = isScrollYMoreThan10;
      nav.classList.toggle("nav--scrolled", isScrollYMoreThan10);
    },
    { passive: true },
  );
};

export default navBarScrollEffect;
