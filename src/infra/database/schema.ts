import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";
import {
  pgTable,
  uuid,
  varchar,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";

const generatedConcat = customType<{
  data: string;
  config: {
    columns: string[];
  };
}>({
  dataType(config) {
    if (config?.columns === undefined) throw new Error("Columns is required");
    const columns = config.columns
      .map((column) => `coalesce(${column}, '')`)
      .join(" || '|' || ");
    return `text GENERATED ALWAYS AS (${columns}) STORED`;
  },
});

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
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
  longitude: decimal("longitude").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  search: generatedConcat("search", {
    columns: ["name", "address", "description", "phone"],
  }),
});

export const locationsRelations = relations(locations, ({ many }) => ({
  events: many(events),
}));

export const events = pgTable("events", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  locationId: uuid("location_id")
    .references(() => locations.id, { onDelete: "restrict" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  validatedAt: timestamp("validated_at", { withTimezone: true }),
});

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  locations: one(locations, {
    fields: [events.locationId],
    references: [locations.id],
  }),
}));
