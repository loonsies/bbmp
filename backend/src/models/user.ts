import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const userModel = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});
