const { deleteItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id }) => {
  await deleteItem({
    keystone,
    listKey: "Customer",
    itemId: id,
  });
};
