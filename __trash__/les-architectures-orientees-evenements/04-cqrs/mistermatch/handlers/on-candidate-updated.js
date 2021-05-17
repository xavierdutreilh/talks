const { updateItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, name, email, password }) => {
  await updateItem({
    keystone,
    listKey: "Candidate",
    item: { id, data: { name, email, password } },
  });
};
