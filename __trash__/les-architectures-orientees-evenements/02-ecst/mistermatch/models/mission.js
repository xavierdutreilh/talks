const {
  DateTime,
  Relationship,
  Select,
  Text,
  Uuid,
} = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");

const eventbus = require("../eventbus");

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
  hooks: {
    afterChange: async ({
      operation,
      updatedItem: {
        id,
        title,
        description,
        startDate,
        endDate,
        status,
        company: companyId,
      },
    }) => {
      await eventbus.publish(
        operation === "create" ? "missionCreated" : "missionUpdated",
        {
          id,
          title,
          description,
          startDate,
          endDate,
          status,
          company: { id: companyId },
        }
      );
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventbus.publish("missionDeleted", { id });
    },
  },
  labelField: "title",
  adminConfig: {
    defaultColumns: "title,status,company,updatedAt",
  },
};
