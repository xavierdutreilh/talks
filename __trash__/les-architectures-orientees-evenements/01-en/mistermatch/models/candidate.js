const { Password, Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");
const { validate: isEmail } = require("email-validator");

const eventbus = require("../eventbus");

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
  hooks: {
    afterChange: async ({ operation, updatedItem: { id, name, email } }) => {
      await eventbus.publish(
        operation === "create" ? "candidateCreated" : "candidateUpdated",
        { id, name, email }
      );
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventbus.publish("candidateDeleted", { id });
    },
  },
  adminConfig: {
    defaultColumns: "name,updatedAt",
  },
};
