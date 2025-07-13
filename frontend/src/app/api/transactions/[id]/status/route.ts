import { NextRequest, NextResponse } from 'next/server';

// Mock database - dalam implementasi real, gunakan database yang sama
const mockTransactions: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = parseInt(params.id);
    
    if (isNaN(transactionId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Simulasi delay untuk meniru API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cari transaksi berdasarkan ID
    const transaction = mockTransactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      totalAmount: transaction.totalAmount,
    });

  } catch (error) {
    console.error('Error checking transaction status:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengecek status transaksi' },
      { status: 500 }
    );
  }
}