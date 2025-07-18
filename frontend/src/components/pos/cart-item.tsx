"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { useCartStore } from "@/lib/store/cart-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";

interface CartItemProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = item.menu.price * item.quantity;

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {item.menu.name}
        </h4>
        <p className="text-sm text-gray-600">
          {formatPrice(item.menu.price)} × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant="destructive"
          className="h-8 w-8 p-0 ml-2"
          onClick={() => { setConfirmDialog(true) }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <ConfirmDialog
          open={confirmDialog}
          onOpenChange={() => { setConfirmDialog(false) }}
          title="Hapus Item"
          description={`Apakah Anda yakin ingin menghapus "${item.menu.name}" dari keranjang?`}
          confirmText="Hapus"
          variant="destructive"
          onConfirm={() => removeItem(item.menu.id)}
        >
        </ConfirmDialog>
      </div>

      <div className="text-right min-w-0">
        <p className="font-semibold text-gray-900">
          {formatPrice(totalPrice)}
        </p>
      </div>
    </div>
  );
}