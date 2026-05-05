import { createCrudRoutes } from "@/lib/db/crud-factory"
const { GET, POST, PUT, DELETE } = createCrudRoutes({ table: "reviews", searchFields: ["author", "product"] })
export { GET, POST, PUT, DELETE }
