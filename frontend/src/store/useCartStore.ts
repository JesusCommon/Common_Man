import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  imagen?: string;
  stock: number;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  addItem: (producto: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  removeItem: (id: string) => void;
  setCantidad: (id: string, cantidad: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (producto, cantidad = 1) =>
        set((state) => {
          const existente = state.items.find((i) => i.id === producto.id);
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.id === producto.id
                  ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...producto, cantidad: Math.min(cantidad, producto.stock) },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setCantidad: (id, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "common-man-cart" }
  )
);

export const selectCartCount = (state: CartState): number =>
  state.items.reduce((acc, i) => acc + i.cantidad, 0);

export const selectCartTotal = (state: CartState): number =>
  state.items.reduce((acc, i) => acc + i.cantidad * i.precio, 0);