const { Keystone } = require("@keystonejs/keystone");
const { KnexAdapter: Adapter } = require("@keystonejs/adapter-knex");

const { Candidate, Company, Customer, Mission } = require("./models");

const keystone = new Keystone({
  adapter: new Adapter({
    knexOptions: {
      connection:
        "postgres://mistertemp:mistertemp@localhost:50081/mistermatch",
    },
  }),
  cookieSecret: "mistermatch",
});

keystone.createList("Candidate", Candidate);
keystone.createList("Company", Company);
keystone.createList("Customer", Customer);
keystone.createList("Mission", Mission);

module.exports = keystone;
