"use client";
import { useEffect } from "react";
import { toast } from "sonner";
export function CartToastListener() {
    useEffect(() => {
        const handler = (e) => {
            const detail = e.detail;
            console.log("Toast:", detail.message, detail.type);
        };
        window.addEventListener("cart-toast", handler);
        return () => window.removeEventListener("cart-toast", handler);
    }, [toast]);
    return null;
}
//# sourceMappingURL=cart-toast-listener.js.map