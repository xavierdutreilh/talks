const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (
  _,
  { id, data: { title, description, startDate, endDate, status, company } }
) => {
  await eventstore.appendToStream("mission", [
    jsonEvent({
      type: "missionUpdated",
      data: {
        id,
        title,
        description,
        startDate,
        endDate,
        status,
        ...(company && {
          company: { id: company.connect ? company.connect.id : null },
        }),
      },
    }),
  ]);

  return { id };
};
