const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { id, data: { name } }) => {
  await eventstore.appendToStream("company", [
    jsonEvent({
      type: "companyUpdated",
      data: { id, name },
    }),
  ]);

  return { id };
};
