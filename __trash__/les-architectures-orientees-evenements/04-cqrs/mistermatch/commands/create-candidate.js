const { v4: uuid } = require("uuid");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (
  _,
  { data: { id = uuid(), name, email, password } }
) => {
  await eventstore.appendToStream("candidate", [
    jsonEvent({
      type: "candidateCreated",
      data: { id, name, email, password },
    }),
  ]);

  return { id };
};
