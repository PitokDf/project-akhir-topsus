"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Menu } from "@/lib/types";
import { useCartStore } from "@/lib/store/cart-store";
import Image from "next/image";

interface ProductCardProps {
  menu: Menu;
}

// Komponen kecil untuk quantity adjuster (tidak berubah)
function QuantityAdjuster({ menu }: { menu: Menu }) {
  const { increaseQuantity, decreaseQuantity, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(menu.id);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          decreaseQuantity(menu.id);
        }}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="font-bold text-lg w-4 text-center">{quantity}</span>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          increaseQuantity(menu.id);
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}


export function ProductCard({ menu }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCartStore();
  const quantityInCart = getItemQuantity(menu.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCardClick = () => {
    // Jika belum ada di keranjang, klik pada kartu akan menambahkannya
    if (quantityInCart === 0) {
      addItem(menu);
    }
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-32 w-full bg-gray-100">
          {menu.imageUrl ? (
            <Image
              src={menu.imageUrl}
              alt={menu.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {menu.name}
            </h3>
            {menu.description && (
              // Menetapkan tinggi minimum agar layout konsisten
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
                {menu.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(menu.price)}
            </span>

            {quantityInCart > 0 ? (
              <QuantityAdjuster menu={menu} />
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah card click handler terpicu lagi
                  addItem(menu);
                }}
                // Tombol muncul saat hover
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}