"use client";

import { useState, useMemo, useEffect } from 'react';
import { mockTransactions } from '@/lib/data/mock-data';
import { Transaction } from '@/lib/types';
import { TransactionSummaryCards } from '../transactions/transaction-summary-card';
import { TransactionFilters } from '../transactions/transaction-filters';
import { TransactionTable } from '../transactions/transaction-table';
import { TransactionDetailModal } from '../transactions/transaction-detail-modal';

export function TransactionHistory() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10; // item per halaman

  // Gunakan useMemo untuk efisiensi agar tidak menghitung ulang pada setiap render
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || transaction.paymentMethod === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [transactions, searchTerm, statusFilter, paymentFilter]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, page]);

  const totalRevenue = useMemo(() => {
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.totalAmount, 0);
  }, [transactions]);

  const transactionsToday = 0;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [page, searchTerm, statusFilter, paymentFilter]);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h2>
        <p className="text-muted-foreground">Monitor semua transaksi yang telah dilakukan</p>
      </div>

      <TransactionSummaryCards
        totalTransactions={transactions.length}
        totalRevenue={totalRevenue}
        transactionsToday={transactionsToday}
      />

      <TransactionFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        paymentFilter={paymentFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onPaymentChange={setPaymentFilter}
      />

      <TransactionTable
        transactions={paginatedTransactions}
        onViewDetails={setSelectedTransaction}
        isLoading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={filteredTransactions.length}
        onPageChange={setPage}
      />

      <TransactionDetailModal
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedTransaction(null);
          }
        }}
      />
    </div>
  );
}