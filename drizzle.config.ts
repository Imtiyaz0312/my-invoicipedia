// import * as dotenv from 'dotenv';
// import { defineConfig } from "drizzle-kit";

// dotenv.config({
//     path: './.env.local'
// })

// if (typeof process.env.XATA_DATABASE_URL !== 'string') {
//     throw new Error('Please set your XATA_DATABASE_URL')
// }

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./src/db/schema.ts",
//   out: "./src/db/migrations",
//   dbCredentials: {
//     url: process.env.XATA_DATABASE_URL
//   }
// });

import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: './.env.local',
  override: true
});

if (typeof process.env.XATA_DATABASE_URL !== 'string') {
  throw new Error('Please set your XATA_DATABASE_URL in .env.local');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    // Append sslmode=require if not already present
    url: process.env.XATA_DATABASE_URL.includes('sslmode=')
      ? process.env.XATA_DATABASE_URL
      : `${process.env.XATA_DATABASE_URL}?sslmode=require`,
    ssl: true // <-- explicitly tell Drizzle to use SSL
  }
});
