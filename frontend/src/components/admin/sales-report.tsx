"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTransactions, mockMenus } from '@/lib/data/mock-data';
import { Transaction } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Calendar, Download } from 'lucide-react';

export function SalesReport() {
  const [dateRange, setDateRange] = useState('today');
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate statistics
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalTransactions = completedTransactions.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Top selling items
  const itemSales = new Map();
  completedTransactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const existing = itemSales.get(item.menuId) || { name: item.menu.name, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.itemTotal;
      itemSales.set(item.menuId, existing);
    });
  });

  const topItems = Array.from(itemSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Payment method breakdown
  const paymentMethods = {
    cash: completedTransactions.filter(t => t.paymentMethod === 'cash').length,
    qris: completedTransactions.filter(t => t.paymentMethod === 'qris').length,
  };

  const handleExport = () => {
    // Simulate export functionality
    alert('Laporan akan diunduh dalam format PDF');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h2>
          <p className="text-gray-600">Analisis performa bisnis Anda</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% dari kemarin
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% dari kemarin
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Transaksi</p>
                <p className="text-2xl font-bold">{formatPrice(averageTransaction)}</p>
                <div className="flex items-center text-sm text-red-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% dari kemarin
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Item Terjual</p>
                <p className="text-2xl font-bold">
                  {completedTransactions.reduce((sum, t) => 
                    sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                  )}
                </p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% dari kemarin
                </div>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Tunai</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{paymentMethods.cash} transaksi</p>
                  <p className="text-sm text-gray-600">
                    {totalTransactions > 0 ? Math.round((paymentMethods.cash / totalTransactions) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>QRIS</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{paymentMethods.qris} transaksi</p>
                  <p className="text-sm text-gray-600">
                    {totalTransactions > 0 ? Math.round((paymentMethods.qris / totalTransactions) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">#{transaction.id.toString().padStart(4, '0')}</p>
                  <p className="text-sm text-gray-600">
                    {transaction.transactionDate.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {transaction.user.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(transaction.totalAmount)}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {transaction.paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}