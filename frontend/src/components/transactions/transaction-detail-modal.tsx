import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { Calendar, User, Banknote, CreditCard, Printer } from 'lucide-react';

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'completed':
            return { variant: 'default', text: 'Selesai' } as const;
        case 'pending':
            return { variant: 'secondary', text: 'Pending' } as const;
        case 'failed':
            return { variant: 'destructive', text: 'Gagal' } as const;
        default:
            return { variant: 'default', text: 'Unknown' } as const;
    }
};

// Helper untuk mendapatkan info pembayaran (ikon dan teks)
const getPaymentInfo = (method: string) => {
    switch (method) {
        case 'cash':
            return { Icon: Banknote, text: 'Tunai' };
        case 'qris':
            return { Icon: CreditCard, text: 'QRIS' };
        default:
            return { Icon: CreditCard, text: 'Lainnya' };
    }
};


// --- Props Interface ---
interface ModalProps {
    transaction: Transaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function TransactionDetailModal({ transaction, open, onOpenChange }: ModalProps) {
    // Guard clause jika tidak ada transaksi yang dipilih
    if (!transaction) return null;

    const statusInfo = getStatusInfo(transaction.status);
    const paymentInfo = getPaymentInfo(transaction.paymentMethod);

    const handlePrint = () => {
        // Logika untuk mencetak struk akan ditambahkan di sini
        console.log("Printing receipt for transaction:", transaction.id);
        alert("Fungsi cetak struk belum diimplementasikan.");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="flex flex-row items-start justify-between">
                    <div>
                        <DialogTitle className="text-xl">Detail Transaksi</DialogTitle>
                        <p className="text-sm text-muted-foreground">#{transaction.id.toString().padStart(4, '0')}</p>
                    </div>
                    <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Bagian Info Utama */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Tanggal</p>
                                <p className="font-medium">{formatDate(transaction.transactionDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Kasir</p>
                                <p className="font-medium">{transaction.user.name}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Bagian Rincian Item */}
                    <div>
                        <h4 className="font-semibold mb-2 text-foreground">Rincian Pesanan</h4>
                        <div className="space-y-2 text-sm">
                            {transaction.items.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {item.menu.name}
                                        <span className="ml-2">x{item.quantity}</span>
                                    </span>
                                    <span className="font-medium">{formatPrice(item.itemTotal)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Bagian Rincian Pembayaran */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">{formatPrice(transaction.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Metode Pembayaran</span>
                            <span className="font-medium flex items-center gap-2">
                                <paymentInfo.Icon className="h-4 w-4" />
                                {paymentInfo.text}
                            </span>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Total */}
                    <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                            {formatPrice(transaction.totalAmount)}
                        </span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Cetak Struk
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}