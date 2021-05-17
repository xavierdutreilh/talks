const { Text, Uuid } = require("@keystonejs/fields");
const { updatedAt } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    name: { type: Text, isRequired: true },
  },
  plugins: [updatedAt({ updatedAtField: "refreshedAt" })],
  adminConfig: {
    defaultColumns: "name,refreshedAt",
  },
};
