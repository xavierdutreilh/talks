const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, title, status }) => {
  await createItem({
    keystone,
    listKey: "Mission",
    item: { id, title, status },
  });
};
