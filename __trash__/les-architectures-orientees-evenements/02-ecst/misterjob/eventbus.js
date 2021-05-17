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

exports.consume = async (eventName, handler) => {
  await connect();

  const channel = await connection.createChannel();

  const exchangeName = `mistertemp.${eventName}`;
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  const queueName = `${exchangeName}.misterjob`;
  await channel.assertQueue(queueName);
  await channel.bindQueue(queueName, exchangeName, "");
  await channel.consume(queueName, async (message) => {
    const payload = JSON.parse(message.content.toString());
    await handler(payload);
    await channel.ack(message);
  });
};

exports.publish = async (eventName, payload) => {
  await connect();

  const channel = await connection.createConfirmChannel();
  const exchangeName = `mistertemp.${eventName}`;
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  await channel.publish(exchangeName, "", Buffer.from(JSON.stringify(payload)));
  await channel.waitForConfirms();
  await channel.close();
};
