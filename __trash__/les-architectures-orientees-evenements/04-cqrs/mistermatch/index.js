const List = require("@keystonejs/keystone/lib/ListTypes/list");
const { mapKeys } = require("@keystonejs/utils");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { END } = require("@eventstore/db-client");

const eventstore = require("./eventstore");
const keystone = require("./keystone");
const {
  onCandidateCreated,
  onCandidateDeleted,
  onCandidateUpdated,
  onCompanyCreated,
  onCompanyDeleted,
  onCompanyUpdated,
  onCustomerCreated,
  onCustomerDeleted,
  onCustomerUpdated,
  onJobCreated,
  onJobDeleted,
  onJobUpdated,
  onMissionCreated,
  onMissionDeleted,
  onMissionUpdated,
} = require("./handlers");

// XXX: allow users to set id fields
List.prototype.getFieldsWithAccess = function ({ schemaName, access }) {
  return this.fields.filter((field) => field.access[schemaName][access]);
};

// XXX: replace database mutations by eventstore mutations
List.prototype.getAdminMeta = function ({ schemaName }) {
  return {
    key: this.key,
    access: mapKeys(this.access[schemaName], (val) => !!val),
    label: this.adminUILabels.label,
    singular: this.adminUILabels.singular,
    plural: this.adminUILabels.plural,
    path: this.adminUILabels.path,
    gqlNames: {
      ...this.gqlNames,
      createMutationName: `createSourced${this.gqlNames.itemQueryName}`,
      updateMutationName: `updateSourced${this.gqlNames.itemQueryName}`,
      deleteMutationName: `deleteSourced${this.gqlNames.itemQueryName}`,
    },
    fields: this.fields
      .filter((field) => field.access[schemaName].read)
      .map((field) => field.getAdminMeta({ schemaName })),
    adminDoc: this.adminDoc,
    adminConfig: this.adminConfig,
  };
};

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: "mistermatch", enableDefaultRoute: true }),
  ],
  configureExpress: () => {
    eventstore
      .subscribeToStream("candidate", { fromRevision: END })
      .on("data", async ({ event: { type: eventName, data: payload } }) => {
        switch (eventName) {
          case "candidateCreated":
            await onCandidateCreated(payload);
            break;
          case "candidateUpdated":
            await onCandidateUpdated(payload);
            break;
          case "candidateDeleted":
            await onCandidateDeleted(payload);
            break;
        }
      });

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
      .subscribeToStream("customer", { fromRevision: END })
      .on("data", async ({ event: { type: eventName, data: payload } }) => {
        switch (eventName) {
          case "customerCreated":
            await onCustomerCreated(payload);
            break;
          case "customerUpdated":
            await onCustomerUpdated(payload);
            break;
          case "customerDeleted":
            await onCustomerDeleted(payload);
            break;
        }
      });

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
