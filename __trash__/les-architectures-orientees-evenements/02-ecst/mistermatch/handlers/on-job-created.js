const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({
  id,
  title,
  status,
  company: { id: companyId },
  mission: { id: missionId },
}) => {
  await createItem({
    keystone,
    listKey: "Job",
    item: {
      id,
      title,
      status,
      ...(companyId && {
        company: companyId && { connect: { id: companyId } },
      }),
      ...(missionId && {
        mission: missionId && { connect: { id: missionId } },
      }),
    },
  });
};
