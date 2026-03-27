// ==========================
// VALIDATOR REGISTRY
// ==========================

// helper function for empty value check
function isEmptyValue(value) {
  // null or undefined
  if (value === undefined || value === null) return true;

  // empty string or string with only spaces
  if (typeof value === "string" && value.trim() === "") return true;

  return false;
}

export const validators = {
  // required field validator
  required(value) {
    if (isEmptyValue(value)) {
      return "This field is required";
    }
    return null;
  },

  // email format validator
  email(value) {
    // skip validation if value is empty; required() handles emptiness
    if (isEmptyValue(value)) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Please enter a valid email";
    }
    return null;
  },

  // minimum length validator
  minLength(value, length) {
    if (isEmptyValue(value)) return;

    if (value.length < length) {
      return `Minimum ${length} characters required`;
    }
    return null;
  },

  // field match validator (e.g. confirm password)
  matchField(value, fieldName, fields) {
    if (isEmptyValue(value)) return null;

    const targetField = fields[fieldName];

    if (!targetField) return null;

    const targetValue = targetField.state.value;

    if (value !== targetValue) {
      return "Passwords must match";
    }

    return null;
  },
};
