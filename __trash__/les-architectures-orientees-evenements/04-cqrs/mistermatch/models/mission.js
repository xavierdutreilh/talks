const {
  DateTime,
  Relationship,
  Select,
  Text,
  Uuid,
} = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    title: { type: Text, isRequired: true },
    description: { type: Text },
    startDate: { type: DateTime },
    endDate: { type: DateTime },
    status: {
      type: Select,
      options: ["created", "started", "ended", "archived"],
      defaultValue: "created",
    },
    company: { type: Relationship, ref: "Company" },
  },
  plugins: [atTracking()],
  labelField: "title",
  adminConfig: {
    defaultColumns: "title,status,company,updatedAt",
  },
};
