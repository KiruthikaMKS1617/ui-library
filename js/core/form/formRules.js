const dataRules = {
  // user data
  name: {
    required: true,
  },
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    minLength: 6,
  },

  // contact form data
  message: {
    required: true,
    minLength: 10,
  },
};

export const formRules = {
  login: {
    email: { ...dataRules.email },
    password: { ...dataRules.password },
  },

  signup: {
    name: { ...dataRules.name },
    email: { ...dataRules.email },
    password: { ...dataRules.password },
    confirmPassword: {
      required: true,
      matchField: "password",
    },
  },

  contact: {
    name: { ...dataRules.name },
    email: { ...dataRules.email },
    message: { ...dataRules.message },
  },
};
