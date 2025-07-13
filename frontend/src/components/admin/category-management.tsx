"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category } from '@/lib/types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Plus, Package, ChevronLeft, ChevronRight } from 'lucide-react';

import { menuService } from '@/lib/service/menu';
import { toast } from 'sonner';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table'; // Import komponen Table
import { CategoryForm, CategoryFormValues } from '../category/category-form';
import { CategoryTable } from '../category/category-table';

export function CategoryManagement() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const response = await menuService.getAllCategories();
        setAllCategories(response);
      } catch (error) {
        toast.error("Gagal memuat kategori.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return allCategories.slice(startIndex, endIndex);
  }, [allCategories, page, PAGE_SIZE]);

  const totalCount = allCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // FUNGSI YANG HILANG - DITAMBAHKAN DI SINI
  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const updatedCategory = await menuService.updateCategory(editingCategory.id, { name: data.name });
        setAllCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
        toast.success("Kategori berhasil diperbarui!");
      } else {
        const newCategory = await menuService.createCategory({ name: data.name });
        setAllCategories(prev => [newCategory, ...prev]);
        toast.success("Kategori berhasil ditambahkan!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    setDeletingCategoryId(deleteTargetId);
    try {
      await menuService.deleteCategory(deleteTargetId);
      setAllCategories(prev => prev.filter(cat => cat.id !== deleteTargetId));
      toast.success("Kategori berhasil dihapus!");
      if (paginatedCategories.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal menghapus kategori.";
      toast.error(errorMessage);
    } finally {
      setDeleteTargetId(null);
      setDeletingCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kelola Kategori</h2>
          <p className="text-muted-foreground">Tambah, edit, atau hapus kategori menu.</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>Total {totalCount} kategori ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Jumlah Menu</TableHead>
                  <TableHead>Dibuat Pada</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <CategoryTable
                categories={paginatedCategories}
                isLoading={isLoading}
                onEdit={handleOpenEditModal} // Sekarang sudah valid
                onDeleteRequest={setDeleteTargetId}
                deletingCategoryId={deletingCategoryId}
                pageSize={PAGE_SIZE}
              />
            </Table>
          </div>
        </CardContent>
        {totalCount > PAGE_SIZE && !isLoading && (
          <CardFooter className="flex items-center justify-between border-t pt-4">
            <div className="text-xs text-muted-foreground">
              Menampilkan halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                <ChevronLeft className="h-4 w-4" /><span className="sr-only">Halaman Sebelumnya</span>
              </Button>
              <span className="text-sm font-medium">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                <ChevronRight className="h-4 w-4" /><span className="sr-only">Halaman Berikutnya</span>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle></DialogHeader>
          <CategoryForm initialData={editingCategory} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Hapus Kategori"
        description="Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}