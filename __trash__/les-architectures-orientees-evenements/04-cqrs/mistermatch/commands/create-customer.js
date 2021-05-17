const { v4: uuid } = require("uuid");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (
  _,
  { data: { id = uuid(), name, email, password, company } }
) => {
  await eventstore.appendToStream("customer", [
    jsonEvent({
      type: "customerCreated",
      data: {
        id,
        name,
        email,
        password,
        ...(company && { company: { id: company.connect.id } }),
      },
    }),
  ]);

  return { id };
};
