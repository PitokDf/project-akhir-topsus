"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Menu, Category } from '@/lib/types';
import { menuService } from '@/lib/service/menu';
import { Plus } from 'lucide-react';
import { MenuFilters } from '../menu/menu-filter';
import { MenuTable } from '../menu/menu-table';
import { MenuForm, MenuFormValues } from '../menu/menu-form';
import { toast } from 'sonner';

export function MenuManagement() {
  const [allMenus, setAllMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // State untuk filter dan paginasi
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5; // Anda bisa sesuaikan ini

  // State untuk modal dan form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk dialog konfirmasi hapus
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Alur data yang diperbaiki: Filter dulu, baru paginasi
  const filteredMenus = useMemo(() => {
    return allMenus.filter(menu => {
      const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || menu.categoryId.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allMenus, searchTerm, selectedCategory]);

  // Buat state baru untuk data yang sudah dipaginasi
  const paginatedMenus = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredMenus.slice(startIndex, endIndex);
  }, [filteredMenus, page, PAGE_SIZE]);

  //  Reset halaman ke 1 setiap kali filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);


  const handleOpenAddModal = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: MenuFormValues) => {
    setIsSubmitting(true);
    try {
      const processedData = {
        ...data,
        categoryId: Number(data.categoryId),
        price: Number(data.price),
      };

      if (editingMenu) {
        const updatedMenu = await menuService.updateMenu(editingMenu.id, processedData);
        setAllMenus(prev => prev.map(m => m.id === updatedMenu.id ? updatedMenu : m));
        toast.success("Menu berhasil diperbarui.");
      } else {
        const newMenu = await menuService.createMenu(processedData);
        setAllMenus(prev => [newMenu, ...prev]);
        toast.success("Menu baru berhasil ditambahkan.");
      }

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Gagal mengirimkan form menu:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat menyimpan menu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null) {
      try {
        await menuService.deleteMenu(deleteTargetId);
        setAllMenus(prev => prev.filter(menu => menu.id !== deleteTargetId));
        setDeleteTargetId(null);
        toast.success("Menu berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus menu:", error);
        toast.error("Gagal menghapus menu.");
      }
    }
  };

  const toggleMenuStatus = async (menuId: number, newStatus: boolean) => {
    try {
      // Optimistic UI Update
      setAllMenus(prev => prev.map(menu =>
        menu.id === menuId ? { ...menu, isActive: newStatus } : menu
      ));

      await menuService.updateMenu(menuId, { isActive: newStatus });
      toast.success(`Status menu berhasil diubah menjadi ${newStatus ? 'aktif' : 'nonaktif'}.`);
    } catch (error) {
      console.error("Gagal mengubah status menu:", error);
      toast.error("Gagal mengubah status menu. Mengembalikan ke status semula.");
      // Rollback on error
      const menuToToggle = allMenus.find(menu => menu.id === menuId);
      if (menuToToggle) {
        setAllMenus(prev => prev.map(menu =>
          menu.id === menuId ? { ...menu, isActive: !newStatus } : menu
        ));
      }
    }
  };


  useEffect(() => {
    const fetchMenusAndCategories = async () => {
      setIsLoading(true);
      try {
        const [fetchedMenus, fetchedCategories] = await Promise.all([
          menuService.getAllMenus(),
          menuService.getAllCategories(),
        ]);
        setAllMenus(fetchedMenus);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Gagal memuat data menu atau kategori:", error);
        toast.error("Gagal memuat data dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenusAndCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kelola Menu</h2>
          <p className="text-muted-foreground">Tambah, edit, atau hapus item menu.</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Menu
        </Button>
      </div>

      <MenuFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />

      <MenuTable
        togglingStatusId={1}
        menus={paginatedMenus}
        totalCount={filteredMenus.length}
        onEdit={handleOpenEditModal}
        onDelete={(id) => setDeleteTargetId(id)}
        onStatusToggle={toggleMenuStatus}
        isLoading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Dialog untuk Tambah/Edit Menu */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">
              {editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}
            </DialogTitle>
            <DialogDescription>
              Isi detail di bawah ini untuk mengelola item menu Anda.
            </DialogDescription>
          </DialogHeader>
          <MenuForm
            onCancel={() => { }}
            initialData={editingMenu}
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog untuk Konfirmasi Hapus */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Hapus Menu"
        description={`Apakah Anda yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}