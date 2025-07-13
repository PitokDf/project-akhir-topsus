"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, CreditCard, Banknote } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AuthService } from "@/lib/auth";
import { CreateTransactionRequest, CreateTransactionResponse } from "@/lib/types";
import Image from "next/image";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentStep = 'method-selection' | 'cash-payment' | 'qris-generation' | 'qris-display' | 'success';

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const { items, getTotalAmount, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [step, setStep] = useState<PaymentStep>('method-selection');
  const [loading, setLoading] = useState(false);
  const [qrisUrl, setQrisUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const totalAmount = getTotalAmount();
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const change = cashReceivedNum - totalAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const resetModal = () => {
    setStep('method-selection');
    setPaymentMethod('cash');
    setCashReceived('');
    setQrisUrl('');
    setTransactionId(null);
    setLoading(false);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const handleCloseModal = () => {
    resetModal();
    onOpenChange(false);
  };

  const createTransaction = async (paymentType: 'cash' | 'qris') => {
    const user = AuthService.getCurrentUser();
    if (!user) return null;

    const transactionData: CreateTransactionRequest = {
      items: items.map(item => ({
        menuId: item.menu.id,
        quantity: item.quantity,
        priceAtSale: item.menu.price,
      })),
      totalAmount,
      paymentMethod: paymentType,
      userId: user.id,
    };

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error('Failed to create transaction');

      const result: CreateTransactionResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Transaction creation failed:', error);
      return null;
    }
  };

  const checkPaymentStatus = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions/${id}/status`);
      if (!response.ok) throw new Error('Failed to check status');
      
      const data = await response.json();
      if (data.status === 'completed') {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setStep('success');
      }
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };

  const handleCashPayment = async () => {
    if (cashReceivedNum < totalAmount) return;

    setLoading(true);
    const result = await createTransaction('cash');
    
    if (result?.success) {
      setStep('success');
    }
    setLoading(false);
  };

  const handleQrisGeneration = async () => {
    setLoading(true);
    const result = await createTransaction('qris');
    
    if (result?.success && result.transaction.paymentUrl) {
      setQrisUrl(result.transaction.paymentUrl);
      setTransactionId(result.transaction.id);
      setStep('qris-display');
    }
    setLoading(false);
  };

  const startPolling = () => {
    if (!transactionId) return;
    
    const interval = setInterval(() => {
      checkPaymentStatus(transactionId);
    }, 3000);
    
    setPollingInterval(interval);
  };

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        clearCart();
        handleCloseModal();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step, clearCart]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const renderContent = () => {
    switch (step) {
      case 'method-selection':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Pembayaran</h3>
              <p className="text-3xl font-bold text-blue-600">{formatPrice(totalAmount)}</p>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Pilih Metode Pembayaran</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'qris') => setPaymentMethod(value)}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="cash" id="cash" />
                  <Banknote className="h-5 w-5 text-green-600" />
                  <Label htmlFor="cash" className="cursor-pointer flex-1">Tunai</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="qris" id="qris" />
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="qris" className="cursor-pointer flex-1">QRIS</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cash-received">Uang Diterima</Label>
                  <Input
                    id="cash-received"
                    type="number"
                    placeholder="0"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {cashReceivedNum > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Kembalian</p>
                    <p className={`text-lg font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPrice(Math.max(0, change))}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <ConfirmDialog
                title="Batalkan Transaksi"
                description="Apakah Anda yakin ingin membatalkan transaksi ini? Semua item di keranjang akan hilang."
                confirmText="Ya, Batalkan"
                cancelText="Tidak"
                variant="destructive"
                onConfirm={handleCloseModal}
              >
                <Button variant="outline" className="flex-1">
                  Batal
                </Button>
              </ConfirmDialog>
              <Button 
                onClick={paymentMethod === 'cash' ? handleCashPayment : handleQrisGeneration}
                disabled={paymentMethod === 'cash' ? cashReceivedNum < totalAmount : false}
                className="flex-1"
              >
                {loading && <LoadingSpinner size="sm" className="mr-2" />}
                {paymentMethod === 'cash' ? 'Konfirmasi Pembayaran' : 'Buat Kode QRIS'}
              </Button>
            </div>
          </div>
        );

      case 'qris-display':
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Kode QRIS</h3>
              <p className="text-gray-600">Total: {formatPrice(totalAmount)}</p>
            </div>

            <div className="flex justify-center">
              <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                <Image
                  src={qrisUrl}
                  alt="QRIS Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Silakan pindai kode QR menggunakan aplikasi pembayaran Anda
            </p>

            <div className="flex gap-3">
              <ConfirmDialog
                title="Batalkan Pembayaran QRIS"
                description="Apakah Anda yakin ingin membatalkan pembayaran QRIS ini? Transaksi akan dibatalkan."
                confirmText="Ya, Batalkan"
                cancelText="Tidak"
                variant="destructive"
                onConfirm={handleCloseModal}
              >
                <Button variant="outline" className="flex-1">
                  Batal
                </Button>
              </ConfirmDialog>
              <Button onClick={startPolling} className="flex-1">
                Cek Status Pembayaran
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-gray-600">Transaksi telah selesai</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(totalAmount)}</p>
            </div>
            <p className="text-sm text-gray-500">Modal akan tertutup otomatis...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'success' ? 'Pembayaran Selesai' : 'Pembayaran'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}