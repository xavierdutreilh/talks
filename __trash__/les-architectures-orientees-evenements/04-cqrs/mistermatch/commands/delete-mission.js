const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id }) => {
  await eventstore.appendToStream("mission", [
    jsonEvent({ type: "missionDeleted", data: { id } }),
  ]);

  return { id };
};
