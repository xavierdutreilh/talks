const { END, excludeSystemEvents } = require("@eventstore/db-client");
const pino = require("pino")();

const eventstore = require("./eventstore");

eventstore
  .subscribeToAll({
    fromPosition: END,
    filter: excludeSystemEvents(),
  })
  .on("data", async ({ event: { type: eventName, data: payload } }) => {
    pino.child({ event: { name: eventName, payload } }).info("event consumed");
  });
