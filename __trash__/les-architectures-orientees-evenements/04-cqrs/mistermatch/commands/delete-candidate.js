const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id }) => {
  await eventstore.appendToStream("candidate", [
    jsonEvent({ type: "candidateDeleted", data: { id } }),
  ]);

  return { id };
};
