"use client";

import { SalesReport } from '@/components/admin/sales-report';

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <SalesReport />
      </div>
    </div>
  );
}