const { updateItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, title, status }) => {
  await updateItem({
    keystone,
    listKey: "Mission",
    item: { id, data: { title, status } },
  });
};
