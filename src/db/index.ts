import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Invoices, Customers } from "@/db/schema";
import * as dotenv from 'dotenv';

dotenv.config({ 
    path: './.env.local',
    override: true }
);

if (!process.env.XATA_DATABASE_URL) {
  throw new Error("❌ XATA_DATABASE_URL is not set. Check .env.local or hosting env vars.");
}
const pool = new Pool({
    connectionString: process.env.XATA_DATABASE_URL,
    max: 20
});

export const db = drizzle(pool, {
    schema: {
        Invoices,
        Customers
    }
});