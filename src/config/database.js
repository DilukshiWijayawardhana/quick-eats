import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

prisma.$on("query", (event) => {
  console.log("Query:", event.query);
});

async function testConnection() {
  try {
    console.log("Attempting to connect to the MySQL database...");

    await prisma.$queryRaw`SELECT 1`;
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the MySQL database:", err.message);
    console.error("Full error details:", err);
    process.exit(1);
  } finally {
    console.log("Disconnecting Prisma Client...");

    await prisma.$disconnect();
  }
}

testConnection();

process.on("SIGINT", async () => {
  console.log("Caught SIGINT, disconnecting Prisma Client...");
  await prisma.$disconnect();
  console.log("Prisma Client disconnected due to application termination.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Caught SIGTERM, disconnecting Prisma Client...");
  await prisma.$disconnect();
  console.log("Prisma Client disconnected due to application termination.");
  process.exit(0);
});

module.exports = prisma;
