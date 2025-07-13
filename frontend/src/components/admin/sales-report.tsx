"use client";

import { useState, useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { SalesReport as ReportData } from '@/lib/types';
import { toast } from 'sonner';
import { SalesReportSkeleton } from './sales-report-skeleton';
import { EmptyState } from '@/components/empty-state';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  PackageOpen,
  Loader2,
} from 'lucide-react';
import { StatCard } from '../ui/stat-card';
import { reportService } from '@/lib/service/report';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export function SalesReport() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  useEffect(() => {
    if (date?.from && date?.to) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await reportService.getSales({ start: date.from!, end: date.to! });
          setReportData(data);
        } catch (error) {
          toast.error("Gagal memuat data laporan.");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [date]);

  const { completedTransactions, paymentMethodStats } = useMemo(() => {
    if (!reportData) return { completedTransactions: [], paymentMethodStats: {} };

    const completed = reportData.transactions.filter(t => t.status === 'completed');

    const stats = completed.reduce((acc, t) => {
      const method = t.paymentMethod.toLowerCase();
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { completedTransactions: completed, paymentMethodStats: stats };
  }, [reportData]);

  const handleDownload = async () => {
    if (!date?.from || !date?.to) {
      toast.error("Silakan pilih rentang tanggal.");
      return;
    }
    setIsDownloading(true);
    toast.info("Mempersiapkan laporan untuk diunduh...");
    try {
      const response = await reportService.downloadSalesReport({ start: date.from, end: date.to });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `laporan-penjualan-${date.from.toISOString().split('T')[0]}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal mengunduh laporan.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <SalesReportSkeleton />;
  }

  if (!reportData) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="Data Laporan Kosong"
        description="Tidak ada data yang ditemukan untuk rentang tanggal yang dipilih. Coba ubah rentang tanggal."
      />
    );
  }

  const totalCompletedTransactions = completedTransactions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h2>
          <p className="text-gray-600">Analisis performa bisnis Anda</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <CalendarDateRangePicker date={date} onDateChange={setDate} />
          <Button onClick={handleDownload} disabled={isDownloading} className="w-full sm:w-auto">
            {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isDownloading ? 'Memproses...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign}
          title="Total Pendapatan"
          value={formatCurrency(reportData.summary.totalRevenue)}
          trend="+12%"
          trendColor="text-green-600" />

        <StatCard
          icon={ShoppingCart}
          title="Total Transaksi"
          value={reportData.summary.totalTransactions}
          trend="+8%"
          trendColor="text-green-600" />

        <StatCard
          icon={TrendingUp}
          title="Rata-rata Transaksi"
          value={formatCurrency(reportData.summary.averagePerTransaction)}
          trend="-2%"
          trendColor="text-red-600" />

        <StatCard icon={Calendar}
          title="Item Terjual"
          value={reportData.summary.totalItemsSold}
          trend="+15%"
          trendColor="text-green-600"
          note="Data ini mungkin tidak akurat karena bug backend." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader><CardTitle>Menu Terlaris</CardTitle></CardHeader>
          <CardContent>
            {reportData.topSellingProducts.length > 0 ? (
              <div className="space-y-4">
                {reportData.topSellingProducts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">{item.rank || index + 1}</div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.quantitySold} terjual</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(item.totalRevenue)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Data menu terlaris tidak tersedia untuk periode ini.</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader><CardTitle>Metode Pembayaran</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(paymentMethodStats).length > 0 ? Object.entries(paymentMethodStats).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${method === 'cash' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="capitalize">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{count} transaksi</p>
                    <p className="text-sm text-gray-600">{totalCompletedTransactions > 0 ? Math.round((count / totalCompletedTransactions) * 100) : 0}%</p>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground text-center py-8">Tidak ada transaksi yang selesai.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader><CardTitle>Transaksi Terbaru (Selesai)</CardTitle></CardHeader>
        <CardContent>
          {completedTransactions.length > 0 ? (
            <div className="space-y-3">
              {completedTransactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">#{t.id.toString().padStart(4, '0')}</p>
                    <p className="text-sm text-gray-600">{new Date(t.transactionDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {t.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(t.totalAmount)}</p>
                    <p className="text-sm text-gray-600 capitalize">{t.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">Tidak ada transaksi yang selesai pada periode ini.</p>}
        </CardContent>
      </Card>
    </div>
  );
}