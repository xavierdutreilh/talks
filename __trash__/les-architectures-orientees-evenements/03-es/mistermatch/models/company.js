const { Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    name: { type: Text, isRequired: true },
  },
  plugins: [atTracking()],
  hooks: {
    afterChange: async ({ operation, updatedItem: { id, name } }) => {
      await eventstore.appendToStream("company", [
        jsonEvent({
          type: operation === "create" ? "companyCreated" : "companyUpdated",
          data: { id, name },
        }),
      ]);
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventstore.appendToStream("company", [
        jsonEvent({
          type: "companyDeleted",
          data: { id },
        }),
      ]);
    },
  },
  adminConfig: {
    defaultColumns: "name,updatedAt",
  },
};
