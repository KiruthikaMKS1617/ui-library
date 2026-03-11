import { validators } from "../validators.js";

// ==========================
// CORE VALIDATION ENGINE
// ==========================

export function validateField({ value, fieldRules, fields }) {
  // if field has no rules → automatically valid
  if (!fieldRules) {
    return {
      valid: true,
      error: null,
      rule: null,
    };
  }

  // iterate through each rule defined for this field
  for (const [rule, config] of Object.entries(fieldRules)) {
    const validator = validators[rule];

    // if validator does not exist → skip
    // this keeps engine flexible for future custom rules
    if (!validator) {
      console.warn(`No validator found for rule: ${rule}`);
      continue;
    }

    // run validator
    const errorMessage = validator(value, config, fields);
    // const errorMsg = validators?.[rule]?.(value, fieldRules[rule]); // alternative way to call the validator

    // if validator returns error → stop validation immediately
    if (errorMessage) {
      return {
        valid: false, // engine can quickly check validity
        error: errorMessage, // UI layer shows this message
        rule: rule, // useful for debugging / analytics
      };
    }
  }

  // if all validators passed
  return {
    valid: true,
    error: null,
    rule: null,
  };
}

//NULL
// Restaurant menu

// Dish not on menu → undefined
// Dish sold out    → null
// Dish available   → value

// const user = {
//   name: "Raj",
//.  middleName: null,
// };

// user.email; // undefined -- property doesn't exist on the user object
// user.middleName; // null -- intentionally set to null to indicate no middle name, but the property exists
