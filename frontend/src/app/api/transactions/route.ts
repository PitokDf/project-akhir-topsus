import { NextRequest, NextResponse } from 'next/server';
import { CreateTransactionRequest, Transaction } from '@/lib/types';

// Mock database untuk simulasi
const mockTransactions: Transaction[] = [];
let transactionCounter = 1;

export async function POST(request: NextRequest) {
  try {
    const data: CreateTransactionRequest = await request.json();

    // Validasi data
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Items tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (!data.userId) {
      return NextResponse.json(
        { success: false, message: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    // Simulasi delay untuk meniru API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let paymentUrl = null;
    let paymentToken = null;
    let status = 'completed'; // Default untuk cash

    // Jika payment method adalah QRIS, generate URL dan set status pending
    if (data.paymentMethod === 'qris') {
      // Simulasi call ke payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock QRIS URL dan token
      paymentToken = `qris_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      paymentUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=QRIS_Payment_${paymentToken}`;
      status = 'pending';
    }

    // Buat transaksi baru
    const newTransaction: Transaction = {
      id: transactionCounter++,
      userId: data.userId,
      user: {
        id: data.userId,
        name: 'Current User',
        email: 'user@example.com',
        role: 'CASHIER',
        createdAt: new Date(),
      },
      transactionDate: new Date(),
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      status: status as 'pending' | 'completed' | 'failed',
      paymentToken,
      paymentUrl,
      items: data.items.map((item, index) => ({
        id: index + 1,
        transactionId: transactionCounter - 1,
        menuId: item.menuId,
        menu: {
          id: item.menuId,
          name: `Menu ${item.menuId}`,
          price: item.priceAtSale,
          categoryId: 1,
          category: { id: 1, name: 'Category', createdAt: new Date(), updatedAt: new Date() },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
        itemTotal: item.priceAtSale * item.quantity,
      })),
    };

    // Simpan ke mock database
    mockTransactions.push(newTransaction);

    // Simulasi auto-complete untuk QRIS setelah delay (untuk demo)
    if (data.paymentMethod === 'qris') {
      setTimeout(() => {
        const transaction = mockTransactions.find(t => t.id === newTransaction.id);
        if (transaction) {
          transaction.status = 'completed';
        }
      }, 10000); // Auto complete setelah 10 detik untuk demo
    }

    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      transaction: newTransaction,
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat transaksi' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    transactions: mockTransactions,
  });
}