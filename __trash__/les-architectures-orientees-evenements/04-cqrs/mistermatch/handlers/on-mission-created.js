const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({
  id,
  title,
  description,
  startDate,
  endDate,
  status,
  company,
}) => {
  await createItem({
    keystone,
    listKey: "Mission",
    item: {
      id,
      title,
      description,
      startDate,
      endDate,
      status,
      ...(company && {
        company: { connect: { id: company.id } },
      }),
    },
  });
};
