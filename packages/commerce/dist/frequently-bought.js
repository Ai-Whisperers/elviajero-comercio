"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
// Content provided by consumer app
const c = {};
const allProducts = c.home?.productCatalog?.products || [];
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, ""); }
export function FrequentlyBought({ currentProduct }) {
    const pairs = useMemo(() => {
        // Try to get from order history
        const users = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("viajero_users") || "[]") : [];
        const boughtWith = {};
        users.forEach((u) => {
            const ords = JSON.parse(localStorage.getItem("viajero_orders_" + u.id) || "[]");
            ords.forEach((o) => {
                const names = o.items?.map((i) => i.name) || [];
                if (names.includes(currentProduct)) {
                    names.forEach((n) => { if (n !== currentProduct)
                        boughtWith[n] = (boughtWith[n] || 0) + 1; });
                }
            });
        });
        const sorted = Object.entries(boughtWith).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return sorted.map(([name]) => allProducts.find((p) => p.name === name)).filter(Boolean);
    }, [currentProduct]);
    if (pairs.length < 1)
        return null;
    return (_jsxs("div", { className: "mt-8", children: [_jsx("h3", { className: "mb-4 text-lg font-bold text-foreground", children: "Comprados juntos frecuentemente" }), _jsx("div", { className: "flex gap-4 overflow-x-auto pb-2", children: pairs.map((p, i) => (_jsxs(Link, { href: "/producto/" + slugify(p.name), className: "flex-shrink-0 w-36 rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md", children: [_jsx("div", { className: "mb-2 aspect-square flex items-center justify-center bg-muted rounded-lg p-2", children: p.imageUrl && _jsx(Image, { src: p.imageUrl, alt: p.name, width: 200, height: 200, className: "h-full w-full object-contain" }) }), _jsx("p", { className: "text-xs font-medium text-foreground line-clamp-2", children: p.name }), _jsx("p", { className: "mt-1 text-sm font-bold text-primary", children: p.price })] }, i))) })] }));
}
//# sourceMappingURL=frequently-bought.js.map