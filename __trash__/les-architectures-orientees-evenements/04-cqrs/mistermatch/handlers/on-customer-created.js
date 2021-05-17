const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, name, email, password, company }) => {
  await createItem({
    keystone,
    listKey: "Customer",
    item: {
      id,
      name,
      email,
      password,
      ...(company && {
        company: { connect: { id: company.id } },
      }),
    },
  });
};
