import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function runMigration() {
    try {
        const sql = neon(process.env.DATABASE_URL!);

        const db = drizzle(sql);

        await migrate(db, { migrationsFolder: "./drizzle" });

    } catch (error) {
        process.exit(1);
    }
}

runMigration();
