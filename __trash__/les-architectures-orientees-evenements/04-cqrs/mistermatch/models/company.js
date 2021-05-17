const { Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    name: { type: Text, isRequired: true },
  },
  plugins: [atTracking()],
  adminConfig: {
    defaultColumns: "name,updatedAt",
  },
};
