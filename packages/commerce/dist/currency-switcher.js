"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
const CURRENCIES = ["PYG", "USD"];
const SYMBOLS = {
    PYG: "₲",
    USD: "$"
};
export function CurrencySwitcher() {
    const [currency, setCurrency] = useState("PYG");
    const toggle = () => {
        const next = CURRENCIES[(CURRENCIES.indexOf(currency) + 1) % CURRENCIES.length];
        setCurrency(next);
        localStorage.setItem("currency", next);
    };
    return (_jsx("button", { onClick: toggle, className: "rounded-md border px-3 py-1 text-sm font-medium transition-colors hover:bg-muted", "aria-label": "Cambiar moneda", children: SYMBOLS[currency] }));
}
//# sourceMappingURL=currency-switcher.js.map