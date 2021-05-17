const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, name }) => {
  await createItem({
    keystone,
    listKey: "Company",
    item: { id, name },
  });
};
