const { createItem } = require("@keystonejs/server-side-graphql-client");

const keystone = require("../keystone");

module.exports = async ({ id, name, email, password }) => {
  await createItem({
    keystone,
    listKey: "Candidate",
    item: { id, name, email, password },
  });
};
