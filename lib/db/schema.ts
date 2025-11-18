import { pgTable, uuid, text, integer, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    

})