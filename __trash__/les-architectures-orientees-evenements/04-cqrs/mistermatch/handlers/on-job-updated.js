const { updateItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, title, status, company, mission }) => {
  await updateItem({
    keystone,
    listKey: "Job",
    item: {
      id,
      data: {
        title,
        status,
        ...(company && {
          company: {
            ...(company.id
              ? { connect: { id: company.id } }
              : company.id === null
              ? { disconnectAll: true }
              : undefined),
          },
        }),
        ...(mission && {
          mission: {
            ...(mission.id
              ? { connect: { id: mission.id } }
              : mission.id === null
              ? { disconnectAll: true }
              : undefined),
          },
        }),
      },
    },
  });
};
