const { v4: uuid } = require("uuid");
const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (
  _,
  {
    data: {
      id = uuid(),
      title,
      description,
      startDate,
      endDate,
      status = "created",
      company,
    },
  }
) => {
  await eventstore.appendToStream("mission", [
    jsonEvent({
      type: "missionCreated",
      data: {
        id,
        title,
        description,
        startDate,
        endDate,
        status,
        ...(company && { company: { id: company.connect.id } }),
      },
    }),
  ]);

  return { id };
};
