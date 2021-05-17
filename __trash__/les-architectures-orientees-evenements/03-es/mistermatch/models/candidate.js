const { Password, Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");
const { validate: isEmail } = require("email-validator");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

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
      await eventstore.appendToStream("candidate", [
        jsonEvent({
          type:
            operation === "create" ? "candidateCreated" : "candidateUpdated",
          data: { id, name, email },
        }),
      ]);
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventstore.appendToStream("candidate", [
        jsonEvent({
          type: "candidateDeleted",
          data: { id },
        }),
      ]);
    },
  },
  adminConfig: {
    defaultColumns: "name,updatedAt",
  },
};
