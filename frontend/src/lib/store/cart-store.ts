"use client";

import { create } from 'zustand';
import { CartItem, Menu } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  addItem: (menu: Menu) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;

  // Fungsi baru yang dibutuhkan oleh ProductCard
  increaseQuantity: (menuId: number) => void;
  decreaseQuantity: (menuId: number) => void;
  getItemQuantity: (menuId: number) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (menu) => {
    const items = get().items;
    const existingItem = items.find(item => item.menu.id === menu.id);

    if (existingItem) {
      // Jika item sudah ada, panggil increaseQuantity
      get().increaseQuantity(menu.id);
    } else {
      // Jika item baru, tambahkan dengan kuantitas 1
      set({
        items: [...items, { menu, quantity: 1 }],
      });
    }
  },

  removeItem: (menuId) => {
    set({
      items: get().items.filter(item => item.menu.id !== menuId),
    });
  },

  updateQuantity: (menuId, quantity) => {
    // Logika ini sudah bagus, jika kuantitas 0 atau kurang, item akan dihapus
    if (quantity <= 0) {
      get().removeItem(menuId);
      return;
    }

    set({
      items: get().items.map(item =>
        item.menu.id === menuId
          ? { ...item, quantity }
          : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalAmount: () => {
    return get().items.reduce((total, item) => {
      return total + (item.menu.price * item.quantity);
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // --- IMPLEMENTASI FUNGSI BARU ---

  /**
   * Menambah kuantitas item yang sudah ada di keranjang sebanyak 1.
   */
  increaseQuantity: (menuId) => {
    const items = get().items;
    const updatedItems = items.map(item =>
      item.menu.id === menuId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    set({ items: updatedItems });
  },

  /**
   * Mengurangi kuantitas item di keranjang. Jika kuantitas menjadi 0, item akan dihapus.
   */
  decreaseQuantity: (menuId) => {
    const items = get().items;
    const existingItem = items.find(item => item.menu.id === menuId);

    // Jika item tidak ada, tidak melakukan apa-apa
    if (!existingItem) return;

    // Jika kuantitasnya 1, maka panggil removeItem
    if (existingItem.quantity === 1) {
      get().removeItem(menuId);
    } else {
      // Jika lebih dari 1, kurangi kuantitasnya
      const updatedItems = items.map(item =>
        item.menu.id === menuId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      set({ items: updatedItems });
    }
  },

  /**
   * Mendapatkan kuantitas dari satu item spesifik di keranjang.
   * Mengembalikan 0 jika item tidak ditemukan.
   */
  getItemQuantity: (menuId) => {
    const item = get().items.find(item => item.menu.id === menuId);
    return item ? item.quantity : 0;
  },

}));