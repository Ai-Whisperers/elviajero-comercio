import { ReactNode } from "react";
import { CartItem } from "../types";
interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (name: string) => void;
    updateQuantity: (name: string, qty: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    savedItems: CartItem[];
    saveItem: (name: string) => void;
    restoreItem: (name: string) => void;
    shareCart: () => string;
}
export declare function CartProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const useCart: () => CartContextType;
export {};
//# sourceMappingURL=cart-context.d.ts.map