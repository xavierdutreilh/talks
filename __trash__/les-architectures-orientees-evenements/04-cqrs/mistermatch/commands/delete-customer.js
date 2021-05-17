const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id }) => {
  await eventstore.appendToStream("customer", [
    jsonEvent({ type: "customerDeleted", data: { id } }),
  ]);

  return { id };
};
