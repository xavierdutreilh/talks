const {
  DateTime,
  Relationship,
  Select,
  Text,
  Uuid,
} = require("@keystonejs/fields");
const { atTracking } = require("@keystonejs/list-plugins");
const { v4: uuid } = require("uuid");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

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
      await eventstore.appendToStream("mission", [
        jsonEvent({
          type: operation === "create" ? "missionCreated" : "missionUpdated",
          data: {
            id,
            title,
            description,
            startDate,
            endDate,
            status,
            company: { id: companyId },
          },
        }),
      ]);
    },
    afterDelete: async ({ existingItem: { id } }) => {
      await eventstore.appendToStream("mission", [
        jsonEvent({
          type: "missionDeleted",
          data: { id },
        }),
      ]);
    },
  },
  labelField: "title",
  adminConfig: {
    defaultColumns: "title,status,company,updatedAt",
  },
};
