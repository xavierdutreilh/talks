const List = require("@keystonejs/keystone/lib/ListTypes/list");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");

const eventbus = require("./eventbus");
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
    eventbus.consume("jobCreated", onJobCreated);
    eventbus.consume("jobUpdated", onJobUpdated);
    eventbus.consume("jobDeleted", onJobDeleted);
  },
};
