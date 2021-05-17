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
      tasks,
      skills,
      status = "created",
      company,
      mission,
    },
  }
) => {
  await eventstore.appendToStream("job", [
    jsonEvent({
      type: "jobCreated",
      data: {
        id,
        title,
        description,
        tasks,
        skills,
        status,
        ...(company && { company: { id: company.connect.id } }),
        ...(mission && { mission: { id: mission.connect.id } }),
      },
    }),
  ]);

  return { id };
};
