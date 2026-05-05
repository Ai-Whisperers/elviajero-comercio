import { createCrudRoutes } from "@/lib/db/crud-factory"
const { GET, POST, PUT, DELETE } = createCrudRoutes({ table: "promo_codes", searchFields: ["code"] })
export { GET, POST, PUT, DELETE }
