const amqp = require("amqplib");
const AsyncLock = require("async-lock");

const lock = new AsyncLock();
let connection;

async function connect() {
  await lock.acquire("connection", async () => {
    connection = await amqp.connect(
      "amqp://mistertemp:mistertemp@localhost:50082/mistertemp"
    );
  });
}

exports.publish = async (eventName, payload) => {
  await connect();

  const channel = await connection.createConfirmChannel();
  const exchangeName = `mistertemp.${eventName}`;
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  await channel.publish(exchangeName, "", Buffer.from(JSON.stringify(payload)));
  await channel.waitForConfirms();
  await channel.close();
};
