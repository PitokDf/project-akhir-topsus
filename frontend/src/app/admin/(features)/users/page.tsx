"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User } from '@/lib/types';
import { userService } from '@/lib/service/user';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Plus, Users } from 'lucide-react';
import { UserList, UserForm } from '@/components/user';
import { Toaster, toast } from 'sonner';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setIsError(true);
        toast.error('Gagal memuat data pengguna.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const resetForm = () => {
    setEditingUser(null);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingUser) {
        const { password, ...otherData } = formData
        const updatedUser = await userService.updateUser(editingUser.id, { ...otherData, ...(formData.password != '' ? { password: formData.password } : {}) });
        setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
        toast.success('Pengguna berhasil diperbarui.');
      } else {
        const newUser = await userService.createUser(formData);
        setUsers(prev => [...prev, newUser]);
        toast.success('Pengguna berhasil ditambahkan.');
      }
      resetForm();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save user:", error.response.data.message);
      const errorMessage = error.response.data.message || 'Gagal menyimpan pengguna.'
      toast.error(errorMessage);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(users.find(user => user.id === userId) || null);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id);
        setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
        toast.success('Pengguna berhasil dihapus.');
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error('Gagal menghapus pengguna.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola User</h2>
          <p className="text-gray-600">Atur akses admin dan kasir</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              isSubmitting={isLoading}
              initialData={editingUser}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar User ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserList
            users={users}
            isLoading={isLoading}
            isError={isError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title="Hapus User"
        description={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}