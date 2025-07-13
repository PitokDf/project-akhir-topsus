import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "@/lib/types";
import { formatPrice } from "@/lib/utils/formatters";
import { MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, ImageOff, PackageOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MenuTableProps {
    menus: Menu[];
    onEdit: (menu: Menu) => void;
    onDelete: (menuId: number) => void;
    onStatusToggle: (menuId: number, newStatus: boolean) => void;
    isLoading: boolean;
    togglingStatusId: number | null;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (newPage: number) => void;
}

export function MenuTable({
    menus,
    onEdit,
    onDelete,
    onStatusToggle,
    isLoading,
    togglingStatusId,
    page,
    pageSize,
    totalCount,
    onPageChange,
}: MenuTableProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const handleImageError = (imageUrl: string) => {
        setImageErrors(prev => new Set(prev).add(imageUrl));
    };

    const renderSkeleton = () => (
        Array.from({ length: pageSize }).map((_, index) => (
            <TableRow key={`skeleton-menu-${index}`} className="animate-pulse">
                <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                <TableCell><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-12 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
            </TableRow>
        ))
    );

    const renderEmptyState = () => (
        <TableRow>
            <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center text-center h-48">
                    <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Tidak Ada Menu</h3>
                    <p className="text-muted-foreground">Belum ada menu yang ditambahkan atau tidak ada yang cocok dengan filter Anda.</p>
                </div>
            </TableCell>
        </TableRow>
    );

    const hasMenus = menus.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Menu</CardTitle>
                <CardDescription>
                    Kelola, edit, dan atur status item menu Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Gambar</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                                <TableHead className="hidden sm:table-cell text-right">Harga</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && !hasMenus ? renderSkeleton() : (
                                !hasMenus ? renderEmptyState() : (
                                    menus.map((menu) => (
                                        <TableRow key={menu.id} data-state={togglingStatusId === menu.id ? "loading" : ""}>
                                            <TableCell>
                                                <div className="w-16 h-16 relative bg-muted rounded-md overflow-hidden flex items-center justify-center">

                                                    {menu.imageUrl && !imageErrors.has(menu.imageUrl) ? (
                                                        <Image
                                                            src={menu.imageUrl}
                                                            alt={menu.name}
                                                            fill
                                                            className="object-cover"
                                                            onError={() => handleImageError(menu.imageUrl!)}
                                                        />
                                                    ) : (
                                                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{menu.name}</div>
                                                {menu.description && (
                                                    <div className="hidden text-sm text-muted-foreground md:inline-block max-w-xs truncate">
                                                        {menu.description}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="outline">{menu.category?.name || 'Tanpa Kategori'}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-right font-medium">
                                                {formatPrice(menu.price)}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={menu.isActive}
                                                    onCheckedChange={(newStatus) => onStatusToggle(menu.id, newStatus)}
                                                    disabled={togglingStatusId === menu.id}
                                                    aria-label={`Toggle status for ${menu.name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Buka menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => onEdit(menu)}><Edit className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => onDelete(menu.id)}><Trash2 className="mr-2 h-4 w-4" /><span>Hapus</span></DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            {totalCount > 0 && (
                <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="text-xs text-muted-foreground">
                        Menampilkan <strong>{Math.min(totalCount, (page - 1) * pageSize + 1)}-{Math.min(totalCount, page * pageSize)}</strong> dari <strong>{totalCount}</strong> hasil
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page - 1)} disabled={page <= 1}><ChevronLeft className="h-4 w-4" /><span className="sr-only">Halaman Sebelumnya</span></Button>
                        <span className="text-sm font-medium">{page} / {totalPages}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}><ChevronRight className="h-4 w-4" /><span className="sr-only">Halaman Berikutnya</span></Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}