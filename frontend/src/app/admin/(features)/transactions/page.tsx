"use client";

import { TransactionHistory } from '@/components/admin/transaction-history';

export default function AdminTransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <TransactionHistory />
      </div>
    </div>

  );
}