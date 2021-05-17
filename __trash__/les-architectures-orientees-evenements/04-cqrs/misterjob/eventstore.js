const { EventStoreDBClient } = require("@eventstore/db-client");

module.exports = EventStoreDBClient.connectionString(
  "esdb://localhost:50084?tls=false"
);
