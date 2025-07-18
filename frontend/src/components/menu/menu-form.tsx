"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Category, Menu } from "@/lib/types";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

// Skema Zod tetap sama, sudah bagus
export const menuFormSchema = z.object({
    name: z.string().min(3, "Nama menu minimal 3 karakter."),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Harga tidak boleh negatif."),
    categoryId: z.string().min(1, "Kategori harus dipilih."),
    imageUrl: z.string().url("URL gambar tidak valid.").optional().or(z.literal('')),
    isActive: z.boolean(),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;

interface MenuFormProps {
    initialData?: Menu | null;
    categories: Category[];
    onSubmit: (data: MenuFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function MenuForm({ initialData, categories, onSubmit, onCancel, isSubmitting }: MenuFormProps) {
    const form = useForm<MenuFormValues>({
        resolver: zodResolver(menuFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            categoryId: initialData?.categoryId?.toString() || "",
            imageUrl: initialData?.imageUrl || "",
            isActive: initialData?.isActive ?? true,
        },
    });

    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        form.reset({
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            categoryId: initialData?.categoryId?.toString() || "",
            imageUrl: initialData?.imageUrl || "",
            isActive: initialData?.isActive ?? true,
        });
        setImagePreview(initialData?.imageUrl || null);
        setImageFile(null);
    }, [initialData, form]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast.error("Ukuran gambar maksimal 2MB.");
                return;
            }
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            form.setValue("imageUrl", previewUrl, { shouldValidate: true });
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        form.setValue("imageUrl", "", { shouldValidate: true, shouldDirty: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const processSubmit = async (data: MenuFormValues) => {
        let finalData = { ...data };

        if (imageFile) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', imageFile);

                const response = await api.post('/menu/menus/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const newImageUrl = response.data.data.url;
                finalData.imageUrl = newImageUrl;
                form.setValue("imageUrl", newImageUrl);
            } catch (error) {
                toast.error("Gagal mengunggah gambar. Silakan coba lagi.");
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        await onSubmit(finalData);
    };

    const totalSubmitting = isSubmitting || isUploading;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processSubmit)} className="flex flex-col h-full">
                <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    {/* Nama Menu */}
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Menu</FormLabel>
                            <FormControl><Input placeholder="cth: Kopi Susu Gula Aren" {...field} disabled={totalSubmitting} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Harga & Kategori */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga</FormLabel>
                                <FormControl><Input type="number" placeholder="cth: 25000" {...field} disabled={totalSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={totalSubmitting}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger></FormControl>
                                    <SelectContent>{categories.map((cat) => (<SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>))}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Deskripsi */}
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi <span className="text-muted-foreground">(Opsional)</span></FormLabel>
                            <FormControl><Textarea placeholder="Deskripsi singkat menu..." {...field} className="min-h-[100px]" disabled={totalSubmitting} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Upload Gambar */}
                    <FormField control={form.control} name="imageUrl" render={() => (
                        <FormItem>
                            <FormLabel>Gambar Menu</FormLabel>
                            <FormControl>
                                <div>
                                    <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                    {imagePreview ? (
                                        <div className="relative w-full aspect-square max-w-xs mx-auto">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                width={256}
                                                height={256}
                                                className="object-cover rounded-md"
                                            />
                                            {/* <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-md" /> */}
                                            <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-background/80 p-1 rounded-full shadow-md backdrop-blur-sm">
                                                <X className="h-4 w-4 text-destructive" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer text-muted-foreground hover:bg-muted/50 transition-colors">
                                            <UploadCloud className="w-8 h-8 mb-2" />
                                            <span className="font-medium">Klik untuk unggah gambar</span>
                                            <span className="text-xs">PNG, JPG, WEBP (Maks. 2MB)</span>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Status */}
                    <FormField control={form.control} name="isActive" render={({ field }) => (
                        <FormItem className="flex items-center justify-between border p-4 rounded-lg">
                            <div>
                                <FormLabel>Aktifkan Menu</FormLabel>
                                <FormDescription>Tampilkan menu ini di halaman kasir.</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={totalSubmitting} /></FormControl>
                        </FormItem>
                    )} />
                </div>

                <div className="flex justify-end gap-2 p-4 border-t bg-background">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={totalSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={totalSubmitting}>
                        {totalSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isUploading ? "Mengunggah..." : (isSubmitting ? "Menyimpan..." : (initialData ? "Update Menu" : "Tambah Menu"))}
                    </Button>
                </div>
            </form>
        </Form>
    );
}