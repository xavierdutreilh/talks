const { Password, Relationship, Text, Uuid } = require("@keystonejs/fields");
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
    company: { type: Relationship, ref: "Company" },
  },
  plugins: [atTracking()],
  hooks: {
    afterChange: async ({
      operation,
      updatedItem: { id, name, email, company: companyId },
    }) => {
      await eventstore.appendToStream("customer", [
        jsonEvent({
          type: operation === "create" ? "customerCreated" : "customerUpdated",
          data: { id, name, email, company: { id: companyId } },
        }),
      ]);
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventstore.appendToStream("customer", [
        jsonEvent({
          type: "customerDeleted",
          data: { id },
        }),
      ]);
    },
  },
  adminConfig: {
    defaultColumns: "name,company,updatedAt",
  },
};
