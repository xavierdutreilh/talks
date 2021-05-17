const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (
  _,
  { id, data: { name, email, password, company } }
) => {
  await eventstore.appendToStream("customer", [
    jsonEvent({
      type: "customerUpdated",
      data: {
        id,
        name,
        email,
        password,
        ...(company && {
          company: { id: company.connect ? company.connect.id : null },
        }),
      },
    }),
  ]);

  return { id };
};
