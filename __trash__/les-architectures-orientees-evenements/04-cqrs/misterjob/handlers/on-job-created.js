const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({
  id,
  title,
  description,
  tasks,
  skills,
  status,
  company,
  mission,
}) => {
  await createItem({
    keystone,
    listKey: "Job",
    item: {
      id,
      title,
      description,
      tasks,
      skills,
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
