import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/formatters";
import { Receipt, CreditCard, Calendar } from 'lucide-react';

interface SummaryCardsProps {
    totalTransactions: number;
    totalRevenue: number;
    transactionsToday: number;
}

export function TransactionSummaryCards({ totalTransactions, totalRevenue, transactionsToday }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Transaksi</p>
                        <p className="text-2xl font-bold">{totalTransactions}</p>
                    </div>
                    <Receipt className="h-8 w-8 text-blue-500" />
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                        <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-green-500" />
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
                        <p className="text-2xl font-bold">{transactionsToday}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                </CardContent>
            </Card>
        </div>
    );
}