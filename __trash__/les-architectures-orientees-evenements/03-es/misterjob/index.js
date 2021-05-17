const List = require("@keystonejs/keystone/lib/ListTypes/list");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { END } = require("@eventstore/db-client");

const eventstore = require("./eventstore");
const keystone = require("./keystone");
const {
  onCompanyCreated,
  onCompanyDeleted,
  onCompanyUpdated,
  onMissionCreated,
  onMissionDeleted,
  onMissionUpdated,
} = require("./handlers");

// XXX: allow users to set id fields
List.prototype.getFieldsWithAccess = function ({ schemaName, access }) {
  return this.fields.filter((field) => field.access[schemaName][access]);
};

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: "misterjob", enableDefaultRoute: true }),
  ],
  configureExpress: () => {
    eventstore
      .subscribeToStream("company", { fromRevision: END })
      .on("data", async ({ event: { type: eventName, data: payload } }) => {
        switch (eventName) {
          case "companyCreated":
            await onCompanyCreated(payload);
            break;
          case "companyUpdated":
            await onCompanyUpdated(payload);
            break;
          case "companyDeleted":
            await onCompanyDeleted(payload);
            break;
        }
      });

    eventstore
      .subscribeToStream("mission", { fromRevision: END })
      .on("data", async ({ event: { type: eventName, data: payload } }) => {
        switch (eventName) {
          case "missionCreated":
            await onMissionCreated(payload);
            break;
          case "missionUpdated":
            await onMissionUpdated(payload);
            break;
          case "missionDeleted":
            await onMissionDeleted(payload);
            break;
        }
      });
  },
};
