const { updateItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({
  id,
  title,
  status,
  company: { id: companyId },
  mission: { id: missionId },
}) => {
  await updateItem({
    keystone,
    listKey: "Job",
    item: {
      id,
      data: {
        title,
        status,
        company: {
          disconnectAll: true,
          ...(companyId && { connect: { id: companyId } }),
        },
        mission: {
          disconnectAll: true,
          ...(missionId && { connect: { id: missionId } }),
        },
      },
    },
  });
};
