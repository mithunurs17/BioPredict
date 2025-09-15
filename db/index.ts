import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prisma = new PrismaClient();

// Test the database connection
async function testConnection() {
  try {
    const result = await prisma.user.findFirst();
    console.log("Database connection test successful");
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    throw error;
  }
}

// Run the connection test
testConnection().catch(console.error);

export { prisma };