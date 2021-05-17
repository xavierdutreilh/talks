const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, title, status, company, mission }) => {
  await createItem({
    keystone,
    listKey: "Job",
    item: {
      id,
      title,
      status,
      ...(company && {
        company: { connect: { id: company.id } },
      }),
      ...(mission && {
        mission: { connect: { id: mission.id } },
      }),
    },
  });
};
