"use client";

import { AuthService } from '@/lib/auth';
import { mockMenus, mockCategories } from '@/lib/data/mock-data';
import {
  Users,
  Coffee,
  ShoppingBag,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { ManagementCard } from '@/components/ui/management-card';
import { useEffect, useState } from 'react';
import { Stats } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { reportService } from '@/lib/service/report';

export default function AdminPage() {
  const user = AuthService.getCurrentUser();

  const [stats, setStats] = useState<Stats>()

  useEffect(() => {
    const fetchStats = async () => {
      const data = await reportService.getStatistics()
      setStats(data)
    }

    fetchStats()
  }, [])
  return (
    < >
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang, {user?.name}!
        </h2>
        <p className="text-gray-600">
          Kelola menu, kategori, dan monitor performa bisnis Anda.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Menu"
          value={stats?.totalMenu ?? 0}
          note="Item menu aktif"
          icon={Coffee}
        />

        <StatCard
          title="Kategori"
          value={stats?.totalCategory ?? 0}
          note="Kategori menu"
          icon={ShoppingBag}
        />

        <StatCard
          title="Pendapatan Hari Ini"
          value={formatPrice(stats?.todayIncome ?? 0)}
          note="+12% dari kemarin"
          icon={TrendingUp}
        />

        <StatCard
          title="Transaksi Hari Ini"
          value={stats?.todayTransaction ?? 0}
          note="+8% dari kemarin"
          icon={BarChart3}
        />
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ManagementCard
          icon={Coffee}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          title="Kelola Menu"
          description="Tambah, edit, atau hapus item menu"
          content="Kelola semua item menu, harga, kategori, dan ketersediaan."
          buttonText="Kelola Menu"
          buttonVariant="default"
          href="/admin/menu"
        />

        <ManagementCard
          icon={ShoppingBag}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          title="Kelola Kategori"
          description="Organisir menu dengan kategori"
          content="Buat dan kelola kategori untuk mengorganisir menu Anda."
          buttonText="Kelola Kategori"
          href="/admin/categories"
        />

        <ManagementCard
          icon={Users}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-600"
          title="Kelola User"
          description="Atur akses admin dan kasir"
          content="Tambah atau hapus user, dan atur role akses sistem."
          buttonText="Kelola User"
          href="/admin/users"
        />

        <ManagementCard
          icon={BarChart3}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          title="Laporan Penjualan"
          description="Analisis performa bisnis"
          content="Lihat laporan penjualan harian, mingguan, dan bulanan."
          buttonText="Lihat Laporan"
          href="/admin/reports"
        />

        <ManagementCard
          icon={TrendingUp}
          iconBgColor="bg-red-100"
          iconTextColor="text-red-600"
          title="Riwayat Transaksi"
          description="Monitor semua transaksi"
          content="Lihat riwayat lengkap semua transaksi yang telah dilakukan."
          buttonText="Lihat Transaksi"
          href="/admin/transactions"
        />
      </div>
    </>
  );
}