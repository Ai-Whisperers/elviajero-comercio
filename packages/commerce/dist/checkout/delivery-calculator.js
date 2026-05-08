"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
// Content provided by consumer app
const c = {};
const zones = c.deliveryZones || [];
export function DeliveryCalculator({ subtotal, onFeeChange }) {
    const [selected, setSelected] = useState("");
    const handleChange = (zoneName) => {
        setSelected(zoneName);
        const zone = zones.find((z) => z.zone === zoneName);
        if (zone && onFeeChange) {
            const fee = zone.minForFree > 0 && subtotal >= zone.minForFree ? 0 : zone.fee;
            onFeeChange(fee);
        }
    };
    if (zones.length === 0)
        return null;
    return (_jsxs("div", { className: "rounded-xl border border-border bg-surface p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground mb-3", children: "Calcular env\u00EDo" }), _jsxs("select", { value: selected, onChange: (e) => handleChange(e.target.value), className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring", children: [_jsx("option", { value: "", children: "Seleccion\u00E1 tu zona" }), zones.map((z) => (_jsx("option", { value: z.zone, children: z.zone }, z.zone)))] }), selected && (() => {
                const zone = zones.find((z) => z.zone === selected);
                if (!zone)
                    return null;
                const isFree = zone.minForFree > 0 && subtotal >= zone.minForFree;
                const fee = isFree ? 0 : zone.fee;
                return (_jsxs("div", { className: "mt-3 text-xs text-muted-foreground space-y-1", children: [_jsxs("p", { children: ["Costo: ", _jsx("span", { className: isFree ? "text-green-600 font-semibold" : "font-medium text-foreground", children: isFree ? "Gratis 🎉" : `Gs. ${(fee || 0).toLocaleString("es-PY")}` })] }), zone.minForFree > 0 && subtotal < zone.minForFree && _jsxs("p", { children: ["\uD83D\uDCE6 Env\u00EDo gratis desde Gs. ", zone.minForFree.toLocaleString("es-PY")] }), _jsxs("p", { children: ["\u23F1 Entrega estimada: ", zone.days] }), zone.note && _jsx("p", { className: "text-muted-foreground/60 italic", children: zone.note })] }));
            })()] }));
}
//# sourceMappingURL=delivery-calculator.js.map