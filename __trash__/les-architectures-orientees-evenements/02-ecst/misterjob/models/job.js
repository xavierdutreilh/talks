const { Relationship, Select, Text, Uuid } = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

const eventbus = require("../eventbus");

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
  hooks: {
    afterChange: async ({
      operation,
      updatedItem: {
        id,
        title,
        description,
        tasks,
        skills,
        status,
        company: companyId,
        mission: missionId,
      },
    }) => {
      await eventbus.publish(
        operation === "create" ? "jobCreated" : "jobUpdated",
        {
          id,
          title,
          description,
          tasks,
          skills,
          status,
          company: { id: companyId },
          mission: { id: missionId },
        }
      );
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventbus.publish("jobDeleted", { id });
    },
  },
  labelField: "title",
  adminConfig: {
    defaultColumns: "title,status,company,mission,updatedAt",
  },
};
