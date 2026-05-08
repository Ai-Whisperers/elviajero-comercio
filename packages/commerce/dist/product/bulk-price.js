"use client";
import { jsxs as _jsxs } from "react/jsx-runtime";
export function getBulkPrice(basePrice, quantity) {
    if (quantity >= 10)
        return Math.round(basePrice * 0.85);
    if (quantity >= 5)
        return Math.round(basePrice * 0.9);
    if (quantity >= 3)
        return Math.round(basePrice * 0.95);
    return basePrice;
}
export function BulkPriceDisplay({ basePrice, quantity }) {
    const discount = getBulkPrice(basePrice, quantity);
    const savings = basePrice - discount;
    if (savings <= 0)
        return null;
    return (_jsxs("div", { className: "rounded-lg bg-success/10 px-2 py-1 text-xs", children: [_jsxs("span", { className: "font-bold text-success", children: ["Gs. ", discount.toLocaleString("es-PY")] }), _jsxs("span", { className: "text-muted-foreground", children: [" (ahorras Gs. ", savings.toLocaleString("es-PY"), ")"] })] }));
}
//# sourceMappingURL=bulk-price.js.map