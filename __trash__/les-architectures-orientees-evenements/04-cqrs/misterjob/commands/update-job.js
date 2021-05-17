const { jsonEvent } = require("@eventstore/db-client");

const eventstore = require("../eventstore");

module.exports = async (
  _,
  { id, data: { title, description, tasks, skills, status, company, mission } }
) => {
  await eventstore.appendToStream("job", [
    jsonEvent({
      type: "jobUpdated",
      data: {
        id,
        title,
        description,
        tasks,
        skills,
        status,
        ...(company && {
          company: { id: company.connect ? company.connect.id : null },
        }),
        ...(mission && {
          mission: { id: mission.connect ? mission.connect.id : null },
        }),
      },
    }),
  ]);

  return { id };
};
