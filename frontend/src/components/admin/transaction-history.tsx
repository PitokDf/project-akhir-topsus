"use client";

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Transaction, Stats } from '@/lib/types';
import { transactionService } from '@/lib/service/transaction';
import { TransactionSummaryCards } from '../transactions/transaction-summary-card';
import { TransactionFilters } from '../transactions/transaction-filters';
import { TransactionTable } from '../transactions/transaction-table';
import { TransactionDetailModal } from '../transactions/transaction-detail-modal';
import { useDebounce } from '../../hooks/use-debounce';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const params = {
          page,
          limit: PAGE_SIZE,
          search: debouncedSearchTerm,
          status: statusFilter === 'all' ? undefined : statusFilter,
          paymentMethod: paymentFilter === 'all' ? undefined : paymentFilter,
        };
        const response = await transactionService.getAllTransactions(params);
        setTransactions(response.data);
        setTotalCount(response.meta.total);

        console.log(response);

      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const statsData = await transactionService.getTransactionStatistics();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }

    fetchTransactions();
    fetchStats();

    const socket = io(process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL || 'http://localhost:3003');

    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    socket.on('transaction:update', (updatedTransaction: Transaction) => {
      console.log('Transaction updated:', updatedTransaction);
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      );
      // Optionally, re-fetch stats if a transaction is completed
      if (updatedTransaction.status === 'completed') {
        fetchStats();
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [page, debouncedSearchTerm, statusFilter, paymentFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h2>
        <p className="text-muted-foreground">Monitor semua transaksi yang telah dilakukan</p>
      </div>

      <TransactionSummaryCards
        totalTransactions={totalCount}
        totalRevenue={stats?.todayIncome ?? 0}
        transactionsToday={stats?.todayTransaction ?? 0}
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
        transactions={transactions}
        onViewDetails={setSelectedTransaction}
        isLoading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
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