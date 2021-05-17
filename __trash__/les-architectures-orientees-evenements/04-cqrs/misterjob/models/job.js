const { Relationship, Select, Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    title: { type: Text, isRequired: true },
    description: { type: Text },
    tasks: { type: Text },
    skills: { type: Text },
    status: {
      type: Select,
      options: ["created", "published", "unpublished", "archived"],
      defaultValue: "created",
    },
    company: { type: Relationship, ref: "Company" },
    mission: { type: Relationship, ref: "Mission" },
  },
  plugins: [atTracking()],
  labelField: "title",
  adminConfig: {
    defaultColumns: "title,status,company,mission,updatedAt",
  },
};
