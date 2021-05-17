const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id, data: { name, email, password } }) => {
  await eventstore.appendToStream("candidate", [
    jsonEvent({
      type: "candidateUpdated",
      data: { id, name, email, password },
    }),
  ]);

  return { id };
};
