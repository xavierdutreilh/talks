const { Relationship, Text, Uuid } = require("@keystonejs/fields");
const { updatedAt } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

module.exports = {
  fields: {
    id: { type: Uuid, defaultValue: uuid },
    title: { type: Text, isRequired: true },
    status: { type: Text, isRequired: true },
    company: { type: Relationship, ref: "Company" },
    mission: { type: Relationship, ref: "Mission" },
  },
  plugins: [updatedAt({ updatedAtField: "refreshedAt" })],
  labelField: "title",
  adminConfig: {
    defaultColumns: "title,status,company,mission,refreshedAt",
  },
};
