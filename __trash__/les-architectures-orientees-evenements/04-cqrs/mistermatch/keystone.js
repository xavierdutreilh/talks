const { Keystone } = require("@keystonejs/keystone");
const { KnexAdapter: Adapter } = require("@keystonejs/adapter-knex");

const {
  createCandidate,
  createCompany,
  createCustomer,
  createMission,
  deleteCandidate,
  deleteCompany,
  deleteCustomer,
  deleteMission,
  updateCandidate,
  updateCompany,
  updateCustomer,
  updateMission,
} = require("./commands");
const { Candidate, Company, Customer, Job, Mission } = require("./models");

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
keystone.createList("Job", Job);
keystone.createList("Mission", Mission);

keystone.extendGraphQLSchema({
  mutations: [
    {
      schema: "createSourcedCandidate(data: CandidateCreateInput): Candidate",
      resolver: createCandidate,
    },
    {
      schema:
        "updateSourcedCandidate(id: ID!, data: CandidateUpdateInput): Candidate",
      resolver: updateCandidate,
    },
    {
      schema: "deleteSourcedCandidate(id: ID!): Candidate",
      resolver: deleteCandidate,
    },
    {
      schema: "createSourcedCompany(data: CompanyCreateInput): Company",
      resolver: createCompany,
    },
    {
      schema:
        "updateSourcedCompany(id: ID!, data: CompanyUpdateInput): Company",
      resolver: updateCompany,
    },
    {
      schema: "deleteSourcedCompany(id: ID!): Company",
      resolver: deleteCompany,
    },
    {
      schema: "createSourcedCustomer(data: CustomerCreateInput): Customer",
      resolver: createCustomer,
    },
    {
      schema:
        "updateSourcedCustomer(id: ID!, data: CustomerUpdateInput): Customer",
      resolver: updateCustomer,
    },
    {
      schema: "deleteSourcedCustomer(id: ID!): Customer",
      resolver: deleteCustomer,
    },
    {
      schema: "createSourcedMission(data: MissionCreateInput): Mission",
      resolver: createMission,
    },
    {
      schema:
        "updateSourcedMission(id: ID!, data: MissionUpdateInput): Mission",
      resolver: updateMission,
    },
    {
      schema: "deleteSourcedMission(id: ID!): Mission",
      resolver: deleteMission,
    },
  ],
});

module.exports = keystone;
