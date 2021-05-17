const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id }) => {
  await eventstore.appendToStream("job", [
    jsonEvent({ type: "jobDeleted", data: { id } }),
  ]);

  return { id };
};
