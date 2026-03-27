import { createFormValidator } from "./engine/createFormValidator.js";
import { formRules } from "./formRules.js";

export default function initForms() {
  console.log("initForms");
  const forms = document.querySelectorAll("[data-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    const formName = form.dataset.form;
    if (!formName) return;
    const rules = formRules[formName];

    if (!rules) return;
    // return in a forEach callback = skip this iteration and go to the next one
    // continue = only works in traditional loops, not in callbacks

    createFormValidator({ form, rules });
  });
}

//initForms - passes form, rules -> createFormValidator -> triggerFieldValidation -> validateField -> validators (e.g., required, email, minLength) -> showError / clearError

// 1.initForms - selects all forms with data-form attribute and initializes form validation for each form by calling createFormValidator for each form and rules defined for every form in formRules.js
// 2.createFormValidator - sets up event listeners for input, blur and submit events on the inputs and form, and triggers field validation with individual input and formRules when these events occur
// 3.triggerFieldValidation - gets the input and rules, then identifies the value and rules for the respective input and calls validateField to get any error messages, and shows or clears error messages accordingly
// 4.validateField - iterates through the validation rules for the field, calls the corresponding validator function for each rule, and returns the first error message encountered (if any) then validates all rules - if all validations pass, it returns null
// 5.validators - contains the actual validation logic for each rule (e.g., required, email, minLength) and returns appropriate error messages when validation fails

// Form Engine Is Now Feature Complete (Vanilla JS)
// ✔ rule registry
// ✔ validator registry
// ✔ field state
// ✔ touched / dirty tracking
// ✔ debounced input validation
// ✔ blur validation
// ✔ submit validation
// ✔ early exit rule validation
// ✔ cross-field validation
// ✔ dependency revalidation
// ✔ focus first error
// ✔ full form state extraction
