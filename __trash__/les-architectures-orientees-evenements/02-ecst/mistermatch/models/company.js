const { Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

const eventbus = require("../eventbus");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    name: { type: Text, isRequired: true },
  },
  plugins: [atTracking()],
  hooks: {
    afterChange: async ({ operation, updatedItem: { id, name } }) => {
      await eventbus.publish(
        operation === "create" ? "companyCreated" : "companyUpdated",
        { id, name }
      );
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventbus.publish("companyDeleted", { id });
    },
  },
  adminConfig: {
    defaultColumns: "name,updatedAt",
  },
};
