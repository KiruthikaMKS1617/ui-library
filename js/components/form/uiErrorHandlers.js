// ==========================
// UI LAYER
// ==========================

function getErrorEl(input) {
  const fieldWrapper = input.closest(".form__field");

  if (!fieldWrapper) {
    return { errorEl: null };
  }

  const errorEl = fieldWrapper.querySelector(".form__error");

  return { errorEl };
}

export function showError({ input, errorMessage }) {
  if (!input || !errorMessage) return;

  input.setAttribute("aria-invalid", "true");

  const { errorEl } = getErrorEl(input);
  if (!errorEl) return; // validating here is must as we would return {errorEl: null} from getErrorEl if the error element is not found, and we don't want to throw an error when trying to set textContent on a null errorEl

  errorEl.textContent = errorMessage;
}

export function clearError({ input }) {
  if (!input) return;

  input.removeAttribute("aria-invalid");

  const { errorEl } = getErrorEl(input);
  if (!errorEl) return;

  errorEl.textContent = "";
}
