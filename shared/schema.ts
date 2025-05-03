import { pgTable, text, serial, integer, boolean, jsonb, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Biomarker records
export const biomarkerRecords = pgTable("biomarker_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fluidType: text("fluid_type").notNull(), // blood, saliva, urine, csf
  biomarkers: jsonb("biomarkers").notNull(), // Store the actual biomarker values as JSON
  predictions: jsonb("predictions").notNull(), // Store the prediction results as JSON
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertBiomarkerRecordSchema = createInsertSchema(biomarkerRecords).pick({
  userId: true,
  fluidType: true,
  biomarkers: true,
  predictions: true,
});

export type InsertBiomarkerRecord = z.infer<typeof insertBiomarkerRecordSchema>;
export type BiomarkerRecord = typeof biomarkerRecords.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  biomarkerRecords: many(biomarkerRecords)
}));

export const biomarkerRecordsRelations = relations(biomarkerRecords, ({ one }) => ({
  user: one(users, {
    fields: [biomarkerRecords.userId],
    references: [users.id]
  })
}));

// Disease reference data
export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  fluidType: text("fluid_type").notNull(),
  description: text("description").notNull(),
  keyBiomarkers: jsonb("key_biomarkers").notNull(), // Array of biomarker names and normal ranges
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertDiseaseSchema = createInsertSchema(diseases).pick({
  name: true,
  fluidType: true,
  description: true,
  keyBiomarkers: true,
});

export type InsertDisease = z.infer<typeof insertDiseaseSchema>;
export type Disease = typeof diseases.$inferSelect;
