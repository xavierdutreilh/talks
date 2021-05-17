const { Password, Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");
const { validate: isEmail } = require("email-validator");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    name: { type: Text, isRequired: true },
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
      hooks: {
        validateInput: ({ resolvedData: { email } }) => {
          if (!isEmail(email)) throw new Error("Failed to validate email");
        },
      },
    },
    password: { type: Password },
  },
  plugins: [atTracking()],
  adminConfig: {
    defaultColumns: "name,updatedAt",
  },
};
