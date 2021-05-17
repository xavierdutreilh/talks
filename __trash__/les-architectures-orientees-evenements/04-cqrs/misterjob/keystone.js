const { Keystone } = require("@keystonejs/keystone");
const { KnexAdapter: Adapter } = require("@keystonejs/adapter-knex");

const { createJob, deleteJob, updateJob } = require("./commands");
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

keystone.extendGraphQLSchema({
  mutations: [
    {
      schema: "createSourcedJob(data: JobCreateInput): Job",
      resolver: createJob,
    },
    {
      schema: "updateSourcedJob(id: ID!, data: JobUpdateInput): Job",
      resolver: updateJob,
    },
    {
      schema: "deleteSourcedJob(id: ID!): Job",
      resolver: deleteJob,
    },
  ],
});

module.exports = keystone;
