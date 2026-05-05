import { createCrudRoutes } from "@/lib/db/crud-factory"
const { GET, POST, PUT, DELETE } = createCrudRoutes({ table: "profiles", searchFields: ["name", "email"] })
export { GET, POST, PUT, DELETE }
