import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const programFields = [
  "AI/ML",
  "Data Science",
  "Engineering",
  "Sustainability",
  "Business",
  "Health",
  "Social Sciences",
  "Arts & Humanities"
] as const;

export type ProgramField = typeof programFields[number];

export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  consortium: text("consortium").notNull(),
  countries: text("countries").array().notNull(),
  field: text("field").notNull(),
  deadline: timestamp("deadline").notNull(),
  durationMonths: integer("duration_months").notNull(),
  tuitionCovered: boolean("tuition_covered").notNull().default(true),
  monthlyAllowance: integer("monthly_allowance"),
  englishRequirement: text("english_requirement"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;

export const deadlines = pgTable("deadlines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull(),
  deadline: timestamp("deadline").notNull(),
  changedOn: timestamp("changed_on").defaultNow(),
  oldDeadline: timestamp("old_deadline"),
});

export const insertDeadlineSchema = createInsertSchema(deadlines).omit({
  id: true,
  changedOn: true,
});

export type InsertDeadline = z.infer<typeof insertDeadlineSchema>;
export type Deadline = typeof deadlines.$inferSelect;

export interface ProgramWithDaysUntil extends Program {
  daysUntilDeadline: number;
}

export interface ProgramStats {
  totalPrograms: number;
  totalCountries: number;
  fields: string[];
  avgDeadlineDays: number;
}

export interface ProgramFilters {
  field?: string;
  country?: string;
  sortBy?: "deadline" | "name";
}
