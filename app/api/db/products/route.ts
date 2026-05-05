import { createCrudRoutes } from "@/lib/db/crud-factory"
const { GET, POST, PUT, DELETE } = createCrudRoutes({ table: "products", searchFields: ["name", "sku"] })
export { GET, POST, PUT, DELETE }
