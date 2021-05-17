const { v4: uuid } = require("uuid");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (_, { data: { id = uuid(), name } }) => {
  await eventstore.appendToStream("company", [
    jsonEvent({
      type: "companyCreated",
      data: { id, name },
    }),
  ]);

  return { id };
};
