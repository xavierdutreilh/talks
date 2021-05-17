const { Keystone } = require("@keystonejs/keystone");
const { KnexAdapter: Adapter } = require("@keystonejs/adapter-knex");

const { Company, Job, Mission } = require("./models");

const keystone = new Keystone({
  adapter: new Adapter({
    knexOptions: {
      connection: "postgres://mistertemp:mistertemp@localhost:50081/misterjob",
    },
  }),
  cookieSecret: "misterjob",
});

keystone.createList("Company", Company);
keystone.createList("Job", Job);
keystone.createList("Mission", Mission);

module.exports = keystone;
