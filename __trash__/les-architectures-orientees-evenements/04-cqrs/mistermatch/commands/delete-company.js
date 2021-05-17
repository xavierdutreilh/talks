const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id }) => {
  await eventstore.appendToStream("company", [
    jsonEvent({ type: "companyDeleted", data: { id } }),
  ]);

  return { id };
};
