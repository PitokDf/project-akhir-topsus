import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';
import { Edit, Trash2, LayoutGrid, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDeleteRequest: (categoryId: number) => void;
    isLoading: boolean;
    deletingCategoryId: number | null;
    pageSize: number;
}

export function CategoryTable({
    categories,
    onEdit,
    onDeleteRequest,
    isLoading,
    deletingCategoryId,
    pageSize
}: CategoryTableProps) {

    const renderSkeleton = () => (
        Array.from({ length: pageSize }).map((_, index) => (
            <TableRow key={`skeleton-category-${index}`} className="animate-pulse">
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell>
                    <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </TableCell>
            </TableRow>
        ))
    );

    const renderEmptyState = () => (
        <TableRow>
            <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center text-center h-48">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Belum Ada Kategori</h3>
                    <p className="text-muted-foreground">Silakan tambahkan kategori baru untuk memulai.</p>
                </div>
            </TableCell>
        </TableRow>
    );

    const hasCategories = categories.length > 0;

    // Logika rendering ini sudah benar, skeleton hanya tampil saat loading awal
    if (isLoading) {
        return <TableBody>{renderSkeleton()}</TableBody>;
    }

    if (!hasCategories) {
        return <TableBody>{renderEmptyState()}</TableBody>;
    }

    return (
        <TableBody>
            {categories.map((category) => {
                const menuCount = category._count?.menus ?? 0;
                const hasMenus = menuCount > 0;
                const isDeleting = deletingCategoryId === category.id;

                return (
                    <TableRow key={category.id} data-state={isDeleting ? "processing" : ""}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                            <Badge variant={hasMenus ? "default" : "secondary"}>
                                {menuCount} menu
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                            {new Date(category.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </TableCell>
                        <TableCell className="text-right">
                            <TooltipProvider delayDuration={100}>
                                <div className="flex gap-2 justify-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="outline" onClick={() => onEdit(category)} disabled={isDeleting}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit Kategori</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span tabIndex={0}>
                                                <Button size="icon" variant="destructive" onClick={() => onDeleteRequest(category.id)} disabled={hasMenus || isDeleting}>
                                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    <span className="sr-only">Hapus</span>
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {hasMenus ? "Tidak bisa dihapus, kategori masih memiliki menu." : "Hapus Kategori"}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TooltipProvider>
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
}