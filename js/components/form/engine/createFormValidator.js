import { validateField } from "./validateField.js";
import { showError, clearError } from "../uiErrorHandlers.js";
import { debounce } from "../../utils/debounce.js";

/*
Purpose:
Validate a field and update UI based on validation result.
Reusable across input, blur and submit.
*/

function validateAndRenderField({ rules, field, fields }) {
  if (!rules || !field) return;
  const input = field.input;
  const name = input.name;
  const value = field.state.value;

  const fieldRules = rules[name];
  if (!fieldRules) return true;

  const result = validateField({ value, fieldRules, fields });

  // ==========================
  // UPDATE FIELD STATE
  // ==========================

  field.state.error = result.valid ? null : result.error;

  // ==========================
  // RENDER UI
  // ==========================

  if (!result.valid && field.state.touched) {
    showError({
      input,
      errorMessage: result.error,
    });

    return false;
  }

  clearError({ input });
  revalidateDependentFields({ name, rules, fields });
  return true;
}

/*
 Revalidate fields that depend on the current field (e.g. confirm password depends on password)
 This ensures that when you change the password, the confirm password field is also revalidated and shows an error if they no longer match.
*/
function revalidateDependentFields({ name, rules, fields }) {
  Object.values(fields).forEach((field) => {
    const fieldName = field.input.name;

    const fieldRules = rules[fieldName];

    if (!fieldRules) return;

    if (fieldRules.matchField === name) {
      validateAndRenderField({
        rules,
        field,
        fields,
      });
    }
  });
}
/*
Derive form-level state from fieldState
*/

function computeFormState(fields) {
  const errors = {};
  let isDirty = false;
  let isValid = true;

  Object.values(fields).forEach((field) => {
    if (field.state.dirty) {
      isDirty = true;
    }

    if (field.state.error) {
      isValid = false;
      errors[field.input.name] = field.state.error;
    }
  });

  return {
    isDirty,
    isValid,
    errors,
  };
}

export function createFormValidator({ form, rules }) {
  if (!form || !rules) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true; // disable submit button initially until user makes changes to the form futher updates using isFormDirty()
  let isSubmitting = false; // to handle beforeunload prompt only when user has made changes but not yet submitted

  const fields = {};

  // ==========================
  // FIELD COLLECTION
  // ==========================

  const inputs = [...form.elements].filter((el) => rules[el.name]);

  if (!inputs.length) return;

  // ==========================
  // FIELD INITIALIZATION + EVENTS
  // ==========================

  inputs.forEach((input) => {
    const name = input.name;
    // --------------------------
    // INITIAL FIELD STATE
    // --------------------------
    fields[name] = {
      input,
      state: {
        value: input.value,
        initialValue: input.value,
        touched: false,
        dirty: false,
        error: null,
      },
    };

    const field = fields[name];

    const debouncedValidate = debounce(
      () =>
        validateAndRenderField({
          rules,
          field,
          fields,
        }),
      300,
    );

    // --------------------------
    // INPUT EVENT
    // --------------------------

    input.addEventListener("input", () => {
      field.state.value = input.value;
      field.state.dirty = input.value !== field.state.initialValue;

      submitBtn.disabled = !isFormDirty();
      debouncedValidate();
    });

    // --------------------------
    // BLUR EVENT
    // --------------------------

    input.addEventListener("blur", () => {
      field.state.touched = true;

      validateAndRenderField({
        rules,
        field,
        fields,
      });
    });
  });

  // ==========================
  // FORM VALIDATION
  // ==========================

  function validateForm() {
    let isFormValid = true;

    for (const field of Object.values(fields)) {
      const fieldValid = validateAndRenderField({
        rules,
        field,
        fields,
      });

      if (!fieldValid) {
        isFormValid = false;
      }
    }

    return isFormValid;
  }

  // ==========================
  // FORM RESET
  // ==========================

  function resetForm() {
    inputs.forEach((input) => {
      const name = input.name;
      const field = fields[name];

      input.value = field.state.initialValue;

      field.state.value = field.state.initialValue;
      field.state.dirty = false;
      field.state.touched = false;
      field.state.error = null;

      clearError({ input });
    });
  }

  // ==========================
  // IS FORM DIRTY - checks if any field in the form has been modified from its initial value
  // ==========================

  function isFormDirty() {
    return Object.values(fields).some((field) => field.state.dirty);
  }

  // ==========================
  // MARK ALL FIELDS TOUCHED
  // ==========================

  function markAllTouched() {
    Object.values(fields).forEach((field) => {
      field.state.touched = true;
    });
  }

  // ==========================
  // GO TO FIRST ERROR - scrolls to and focuses the first field with an error after form submission
  // ==========================
  function goToFirstError() {
    const firstErrorField = Object.values(fields).find(
      (field) => field.state.error,
    );

    if (!firstErrorField) return;

    const input = firstErrorField.input;

    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    input.focus();
  }

  // ==========================
  // FORM STATE ACCESSORS
  // ==========================

  function getFieldState(name) {
    return fields[name] ? fields[name].state : null;
  }

  function getFormState() {
    return computeFormState(fields);
  }

  function getFormData() {
    const data = {};
    Object.entries(fields).forEach(([name, field]) => {
      data[name] = field.state.value;
    });
    return data;
  }

  window.addEventListener("beforeunload", (e) => {
    if (isFormDirty() && !isSubmitting) {
      e.preventDefault();
      // returnValue required for browser compatibility
      e.returnValue = "";
    }
  });

  // ==========================
  // FORM SUBMIT HANDLER
  // ==========================

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    markAllTouched();

    const isFormValid = validateForm();
    if (!isFormValid) {
      goToFirstError();
      return;
    }

    // read form state on successful validation - this can be sent to server or used as needed
    const formState = getFormState();
    console.log("Form State:", formState);
    const formData = getFormData();
    console.log("Form Data:", formData);
    isSubmitting = true;
    console.log("Form is valid. Ready to submit.");
    // form.submit();
  });

  // ==========================
  // PUBLIC API
  // ==========================

  return {
    validateForm,
    resetForm,
    getFieldState,
    getFormState,
    goToFirstError,
  };
}
