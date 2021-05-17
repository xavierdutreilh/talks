const { updateItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, name }) => {
  await updateItem({
    keystone,
    listKey: "Company",
    item: { id, data: { name } },
  });
};
