// src/components/transactions/TransactionTable.tsx
import {
    Card,
    CardHeader,
    CardTitle,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { Eye, Banknote, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";

// --- Helper Functions (Idealnya berada di file utils) ---
const getStatusBadge = (status: string) => {
    const variants = {
        completed: "success",
        pending: "secondary",
        failed: "destructive",
    } as const;
    const labels = {
        completed: "Selesai",
        pending: "Pending",
        failed: "Gagal",
    };
    return (
        <Badge variant={variants[status as keyof typeof variants] as any || "default"}>
            {labels[status as keyof typeof labels] || "Unknown"}
        </Badge>
    );
};

const getPaymentIcon = (method: string) => {
    return method === "cash" ? (
        <Banknote className="h-4 w-4 text-muted-foreground" />
    ) : (
        <CreditCard className="h-4 w-4 text-muted-foreground" />
    );
};


// --- Props Interface ---
interface TableProps {
    transactions: Transaction[];
    onViewDetails: (transaction: Transaction) => void;
    isLoading: boolean;
    // Props untuk paginasi
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (newPage: number) => void;
}

export function TransactionTable({
    transactions,
    onViewDetails,
    isLoading,
    page,
    pageSize,
    totalCount,
    onPageChange
}: TableProps) {
    const totalPages = Math.ceil(totalCount / pageSize);

    const renderSkeleton = () => (
        Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-14" /></TableCell>
                <TableCell><Skeleton className="h-8 w-10" /></TableCell>
            </TableRow>
        ))
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                                <TableHead className="hidden lg:table-cell">Kasir</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="hidden sm:table-cell">Pembayaran</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? renderSkeleton() : (
                                transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <TableRow
                                            key={transaction.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => onViewDetails(transaction)}
                                        >
                                            <TableCell className="font-medium">
                                                #{transaction.id.toString().padStart(4, "0")}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatDate(transaction.transactionDate)}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {transaction.user.name}
                                            </TableCell>
                                            <TableCell className="font-medium text-right">
                                                {formatPrice(transaction.totalAmount)}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    {getPaymentIcon(transaction.paymentMethod)}
                                                    <span className="capitalize">
                                                        {transaction.paymentMethod === "cash" ? "Tunai" : "QRIS"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {getStatusBadge(transaction.status)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Mencegah row click terpicu
                                                        onViewDetails(transaction);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="hidden sm:inline ml-2">Detail</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Tidak ada transaksi yang ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    Halaman {page} dari {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Sebelumnya</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        <span className="hidden sm:inline mr-1">Berikutnya</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}