"use client";

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/auth-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/scrollable-tabs';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from '@/components/pos/product-card';
import { PaymentModal } from '@/components/pos/payment-modal';
import { CartPanel } from '@/components/pos/cart-panel';
import { useCartStore } from '@/lib/store/cart-store';
import { ShoppingCart, PackageOpen } from 'lucide-react';
import Header from '@/components/layout/header';
import { Category, Menu } from '@/lib/types';
import { menuService } from '@/lib/service/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';

export default function CashierPage() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const getMenusByCategory = (categoryId: number) => {
    return menus.filter(menu => menu.categoryId === categoryId && menu.isActive);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedCategories, fetchedMenus] = await Promise.all([
          menuService.getAllCategories(),
          menuService.getAllMenus()
        ]);

        setCategories(fetchedCategories);

        setMenus(fetchedMenus);
      } catch (error) {
        console.error("Gagal memuat data POS:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = () => {
    if (totalItems > 0) {
      setPaymentModalOpen(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div>
          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <EmptyState
          icon={PackageOpen}
          title="Toko Belum Siap"
          description="Belum ada kategori yang bisa dijual. Silakan tambahkan melalui halaman admin."
        />
      );
    }

    return (
      <Tabs defaultValue={categories[0]?.id.toString()} className="w-full">
        <TabsList className="mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => {
          const categoryMenus = getMenusByCategory(category.id);
          return (
            <TabsContent key={category.id} value={category.id.toString()}>
              {categoryMenus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryMenus.map((menu) => (
                    <ProductCard key={menu.id} menu={menu} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={PackageOpen}
                  title="Menu Kosong"
                  description={`Saat ini belum ada menu yang aktif di kategori "${category.name}".`}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    );
  };

  return (
    <AuthGuard requiredRole="CASHIER">
      <div className="flex flex-col h-screen bg-slate-50">
        <Header
          title="Point of Sale"
          subtitle="Halaman Kasir"
          icon={<ShoppingCart className="h-6 w-6" />}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Daftar Menu</h2>
              <p className="text-gray-600">Pilih item untuk ditambahkan ke keranjang.</p>
            </div>
            {renderContent()}
          </div>

          <div className="hidden lg:block w-96 border-l bg-white">
            <CartPanel onCheckout={handleCheckout} />
          </div>
        </div>

        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 h-16 w-16 shadow-lg flex items-center justify-center">
                <ShoppingCart className="h-7 w-7 text-white" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full text-xs">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[450px] p-0 flex flex-col">
              <CartPanel onCheckout={handleCheckout} />
            </SheetContent>
          </Sheet>
        </div>

        <PaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
        />
      </div>
    </AuthGuard>
  );
}