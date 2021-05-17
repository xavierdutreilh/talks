const List = require("@keystonejs/keystone/lib/ListTypes/list");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");

const eventbus = require("./eventbus");
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
    eventbus.consume("companyCreated", onCompanyCreated);
    eventbus.consume("companyUpdated", onCompanyUpdated);
    eventbus.consume("companyDeleted", onCompanyDeleted);
    eventbus.consume("missionCreated", onMissionCreated);
    eventbus.consume("missionUpdated", onMissionUpdated);
    eventbus.consume("missionDeleted", onMissionDeleted);
  },
};
