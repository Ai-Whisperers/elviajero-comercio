"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const steps = [
    { id: "info", label: "Tus datos" },
    { id: "entrega", label: "Entrega" },
    { id: "pago", label: "Pago" },
    { id: "confirmar", label: "Confirmar" },
];
export function CheckoutStepper({ current }) {
    const currentIdx = steps.findIndex(s => s.id === current);
    return (_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "flex items-center justify-between", children: steps.map((step, i) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${i <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: i < currentIdx ? "✓" : i + 1 }), _jsx("span", { className: `mt-1 text-[10px] font-medium ${i <= currentIdx ? "text-primary" : "text-muted-foreground"}`, children: step.label })] }, step.id))) }), _jsxs("div", { className: "relative mt-2", children: [_jsx("div", { className: "absolute top-0 left-0 h-0.5 bg-muted w-full" }), _jsx("div", { className: "absolute top-0 left-0 h-0.5 bg-primary transition-all", style: { width: `${(currentIdx / (steps.length - 1)) * 100}%` } })] })] }));
}
//# sourceMappingURL=checkout-stepper.js.map