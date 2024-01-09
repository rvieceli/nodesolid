import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  password_hash: varchar("password_hash").notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export const locations = pgTable("locations", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name").notNull(),
  address: varchar("address").notNull(),
  description: varchar("description"),
  phone: varchar("phone").notNull(),
  latitude: decimal("latitude").notNull(),
  longitude: decimal("latitude").notNull(),
});

export const locationsRelations = relations(locations, ({ many }) => ({
  events: many(events),
}));

export const events = pgTable("events", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  location_id: uuid("location_id")
    .references(() => locations.id, { onDelete: "restrict" })
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  validated_at: timestamp("validated_at", { withTimezone: true }),
});

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.user_id],
    references: [users.id],
  }),
  locations: one(locations, {
    fields: [events.location_id],
    references: [locations.id],
  }),
}));
