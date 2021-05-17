const List = require("@keystonejs/keystone/lib/ListTypes/list");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");

const keystone = require("./keystone");

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
};
