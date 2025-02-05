import { pgTable, serial, varchar, integer, text } from 'drizzle-orm/pg-core';
import { userModel } from './user';

export const songModel = pgTable('songs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  download: varchar('download', { length: 255 }).notNull(),
  source: varchar('source', { length: 255 }).notNull(),
  comment: text('comment'),
  tags: text('tags'),
  authorId: integer('author_id').notNull().references(() => userModel.id)
});
