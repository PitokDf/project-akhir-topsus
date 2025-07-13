"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/types';
import { Shield, UserCheck } from 'lucide-react';
import { UserActions } from './user-actions';

interface UserListProps {
    users: User[];
    isLoading: boolean;
    isError: boolean;
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

export function UserList({ users, isLoading, isError, onEdit, onDelete }: UserListProps) {
    const getRoleIcon = (role: 'ADMIN' | 'CASHIER') => {
        return role === 'ADMIN' ? <Shield className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />;
    };

    const getRoleBadgeVariant = (role: 'ADMIN' | 'CASHIER') => {
        return role === 'ADMIN' ? 'default' : 'secondary';
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Bergabung</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                            Memuat user...
                        </TableCell>
                    </TableRow>
                )}
                {isError && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-red-500">
                            Gagal memuat user.
                        </TableCell>
                    </TableRow>
                )}
                {!isLoading && users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            Belum ada user yang terdaftar
                        </TableCell>
                    </TableRow>
                )}
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                                {getRoleIcon(user.role)}
                                {user.role === 'ADMIN' ? 'Admin' : 'Kasir'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                            <UserActions onEdit={() => onEdit(user)} onDelete={() => onDelete(user.id)} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}