"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartItemComponent } from "@/components/pos/cart-item";
import { useCartStore } from "@/lib/store/cart-store";
import { ShoppingCart } from "lucide-react";

interface CartPanelProps {
    onCheckout: () => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export function CartPanel({ onCheckout }: CartPanelProps) {
    // Ambil data langsung dari store
    const { items, getTotalAmount, getTotalItems } = useCartStore();
    const totalAmount = getTotalAmount();
    const totalItems = getTotalItems();

    return (
        <Card className="flex flex-col h-full rounded-none border-0 bg-white">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between">
                    <span>Keranjang</span>
                    <Badge variant="secondary">{totalItems} item</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Keranjang kosong</p>
                            <p className="text-sm text-gray-400">Tambahkan item dari menu</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <CartItemComponent key={item.menu.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatPrice(totalAmount)}
                            </span>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={onCheckout}
                        >
                            Bayar
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}