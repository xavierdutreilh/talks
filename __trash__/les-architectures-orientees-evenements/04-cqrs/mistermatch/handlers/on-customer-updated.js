const { updateItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, name, email, password, company }) => {
  await updateItem({
    keystone,
    listKey: "Customer",
    item: {
      id,
      data: {
        name,
        email,
        password,
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
