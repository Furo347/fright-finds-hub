import "dotenv/config";
import bcrypt from "bcrypt";
import sequelize from "./db";
import { Admin } from "./models";

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("ADMIN_USERNAME or ADMIN_PASSWORD missing in environment");
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    await Admin.sync();

    const hash = await bcrypt.hash(password, 10);
    await Admin.upsert({ username, password: hash });

    console.log(`Admin ${username} created/updated successfully.`);
  } catch (err) {
    console.error("Failed to create admin", err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();

