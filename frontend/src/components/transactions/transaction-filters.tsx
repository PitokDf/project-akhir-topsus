import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Search } from 'lucide-react';

interface FiltersProps {
    searchTerm: string;
    statusFilter: string;
    paymentFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPaymentChange: (value: string) => void;
}

export function TransactionFilters({
    searchTerm, statusFilter, paymentFilter,
    onSearchChange, onStatusChange, onPaymentChange
}: FiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Cari ID atau nama kasir..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={statusFilter} onValueChange={onStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="completed">Selesai</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Gagal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={paymentFilter} onValueChange={onPaymentChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Pembayaran</SelectItem>
                                <SelectItem value="cash">Tunai</SelectItem>
                                <SelectItem value="qris">QRIS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}