const List = require("@keystonejs/keystone/lib/ListTypes/list");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { END } = require("@eventstore/db-client");

const eventstore = require("./eventstore");
const keystone = require("./keystone");
const { onJobCreated, onJobDeleted, onJobUpdated } = require("./handlers");

// XXX: allow users to set id fields
List.prototype.getFieldsWithAccess = function ({ schemaName, access }) {
  return this.fields.filter((field) => field.access[schemaName][access]);
};

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: "mistermatch", enableDefaultRoute: true }),
  ],
  configureExpress: () => {
    eventstore
      .subscribeToStream("job", { fromRevision: END })
      .on("data", async ({ event: { type: eventName, data: payload } }) => {
        switch (eventName) {
          case "jobCreated":
            await onJobCreated(payload);
            break;
          case "jobUpdated":
            await onJobUpdated(payload);
            break;
          case "jobDeleted":
            await onJobDeleted(payload);
            break;
        }
      });
  },
};
