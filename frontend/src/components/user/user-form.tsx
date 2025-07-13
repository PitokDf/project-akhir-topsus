"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { User } from '@/lib/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const userFormSchema = z.object({
    name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
    email: z.string().email({ message: 'Format email tidak valid.' }),
    password: z.string().min(8, 'Password minimal 8 karakter.').optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'CASHIER'], { required_error: 'Role harus dipilih.' }),
}).refine(data => {
    return true;
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
    initialData: User | null;
    onSubmit: (formData: UserFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isSubmitting }: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            password: '',
            role: initialData?.role || 'CASHIER',
        },
    });

    useEffect(() => {
        form.reset({
            name: initialData?.name || '',
            email: initialData?.email || '',
            password: '',
            role: initialData?.role || 'CASHIER',
        });
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                                <Input placeholder="cth: Budi Santoso" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="user@example.com" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormDescription>
                                {initialData ? 'Kosongkan jika tidak ingin mengubah password.' : 'Minimal 8 karakter.'}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role untuk pengguna" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="CASHIER">Kasir</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Update Pengguna' : 'Tambah Pengguna'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}