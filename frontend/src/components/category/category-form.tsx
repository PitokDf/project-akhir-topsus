"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Category } from "@/lib/types";
import { useEffect } from "react";

// Skema validasi Zod
export const categoryFormSchema = z.object({
    name: z.string().min(3, "Nama kategori minimal 3 karakter"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
    initialData?: Category | null;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
    isSubmitting: boolean;
}

export function CategoryForm({ initialData, onSubmit, isSubmitting }: CategoryFormProps) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: initialData?.name || "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        form.reset({
            name: initialData?.name || "",
        });
    }, [initialData, form.reset]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Kategori</FormLabel>
                            <FormControl>
                                <Input placeholder="cth: Minuman Kopi" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Menyimpan..." : (initialData ? "Update Kategori" : "Tambah Kategori")}
                </Button>
            </form>
        </Form>
    );
}