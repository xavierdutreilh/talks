const { Password, Relationship, Text, Uuid } = require("@keystonejs/fields");
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
    company: { type: Relationship, ref: "Company" },
  },
  plugins: [atTracking()],
  hooks: {
    afterChange: async ({
      operation,
      updatedItem: { id, name, email, company: companyId },
    }) => {
      await eventbus.publish(
        operation === "create" ? "customerCreated" : "customerUpdated",
        { id, name, email, company: { id: companyId } }
      );
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventbus.publish("customerDeleted", { id });
    },
  },
  adminConfig: {
    defaultColumns: "name,company,updatedAt",
  },
};
