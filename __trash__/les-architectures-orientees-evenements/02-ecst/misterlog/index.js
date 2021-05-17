const pino = require("pino")();

const eventbus = require("./eventbus");

for (const eventName of [
  "candidateCreated",
  "candidateUpdated",
  "candidateDeleted",
  "companyCreated",
  "companyUpdated",
  "companyDeleted",
  "customerCreated",
  "customerUpdated",
  "customerDeleted",
  "jobCreated",
  "jobUpdated",
  "jobDeleted",
  "missionCreated",
  "missionUpdated",
  "missionDeleted",
]) {
  eventbus.consume(eventName, (payload) =>
    pino.child({ event: { name: eventName, payload } }).info("event consumed")
  );
}
