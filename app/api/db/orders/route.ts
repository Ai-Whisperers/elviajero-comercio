import { createCrudRoutes } from "@/lib/db/crud-factory"
const { GET, POST, PUT, DELETE } = createCrudRoutes({ table: "orders", searchFields: ["id", "customer_email"] })
export { GET, POST, PUT, DELETE }
