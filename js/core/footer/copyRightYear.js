const copyRightYear = () => {
  const el = document.querySelector(".copyright-year");
  if (el) el.textContent = new Date().getFullYear();
};

export default copyRightYear;
