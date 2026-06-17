import bcrypt from "bcrypt";
import sql from "./db.js";

async function seedAdmin() {
  try {
    const username = "admin";
    const password = "admin123";

    // check if user already exists
    const existingUser = await sql`
      SELECT * FROM users
      WHERE username = ${username}
    `;

    if (existingUser.length > 0) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${passwordHash})
    `;

    console.log("Admin user created!");
    console.log("Username: admin");
    console.log("Password: admin123");

    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  }
}

seedAdmin();