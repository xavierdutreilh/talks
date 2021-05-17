const { updateItem } = require("@keystonejs/server-side-graphql-client");

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
  await updateItem({
    keystone,
    listKey: "Mission",
    item: {
      id,
      data: {
        title,
        description,
        startDate,
        endDate,
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
      },
    },
  });
};
