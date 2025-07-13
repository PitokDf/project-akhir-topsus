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
import { transactionService } from "@/lib/service/transaction";
import { io } from "socket.io-client";
import { toast } from "sonner";

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
  const [isCancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);

  const handleCancelTransaction = async (transactionId: string) => {
    setLoading(true);
    try {
      await transactionService.cancelTransaction(transactionId);
      toast.success("Transaksi berhasil dibatalkan.");
      return true;
    } catch (error) {
      console.error('Failed to cancel transaction:', error);
      toast.error("Gagal membatalkan transaksi.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't establish socket connection if modal is not open
    if (!open) return;

    const socket = io(process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL || 'http://localhost:3003');

    socket.on('connect', () => {
      console.log('Connected to transaction service socket');
    });

    socket.on('transaction:update', (transaction) => {

      if (transaction.status === "SUCCESS") {
        setStep('success');
      }
    });

    return () => {
      console.log('Disconnecting from transaction service socket');
      socket.disconnect();
    };
  }, [open]);

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

  const resetModalState = () => {
    setStep('method-selection');
    setPaymentMethod('cash');
    setCashReceived('');
    setQrisUrl('');
    setLoading(false);
    setCancelModalOpen(false);
    setCurrentTransactionId(null);
  };

  const handleConfirmClose = () => {
    resetModalState();
    onOpenChange(false);
  };

  const handleAttemptClose = () => {
    // If QRIS is displayed, show a confirmation dialog before closing.
    // Otherwise, allow closing.
    if (step === 'qris-display' || step === 'method-selection') {
      setCancelModalOpen(true);
    } else {
      handleConfirmClose();
    }
  };

  const createTransaction = async (paymentType: 'cash' | 'qris') => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      toast.error("User not found. Please log in again.");
      return null;
    };
    setLoading(true);
    try {
      const transactionData: CreateTransactionRequest = {
        items: items.map(item => ({
          menuId: item.menu.id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentType,
        userId: user.id,
      };

      const response = await transactionService.createTransaction(transactionData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create transaction');
      }

      const res = response as CreateTransactionResponse;
      if (res.success && res.data.id) {
        setCurrentTransactionId(res.data.id.toString());
      }
      return res;
    } catch (error) {
      console.error('Transaction creation failed:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    if (cashReceivedNum < totalAmount) return;

    const result = await createTransaction('cash');
    if (result) {
      setStep('success');
    }
  };

  const handleQrisGeneration = async () => {
    const result = await createTransaction('qris');
    if (result?.success && result.data.paymentUrl) {
      setQrisUrl(result.data.paymentUrl);
      setStep('qris-display');
    }
  };

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        clearCart();
        handleConfirmClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [step, clearCart]);


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
                <Label htmlFor="cash" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                  <RadioGroupItem value="cash" id="cash" />
                  <Banknote className="h-5 w-5 text-green-600" />
                  <span className="flex-1">Tunai</span>
                </Label>
                <Label htmlFor="qris" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                  <RadioGroupItem value="qris" id="qris" />
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="flex-1">QRIS</span>
                </Label>
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
              <Button variant="outline" onClick={handleAttemptClose} className="flex-1">
                Batal
              </Button>
              <Button
                onClick={paymentMethod === 'cash' ? handleCashPayment : handleQrisGeneration}
                disabled={loading || (paymentMethod === 'cash' ? cashReceivedNum < totalAmount : false)}
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
              {qrisUrl ? (
                <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                  <Image
                    src={qrisUrl}
                    alt="QRIS Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                    priority
                  />
                </div>
              ) : <LoadingSpinner size="lg" />}
            </div>

            <p className="text-sm text-gray-600">
              Silakan pindai kode QR menggunakan aplikasi pembayaran Anda.
              Jangan tutup jendela ini.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleAttemptClose} className="w-full">
                Batalkan Transaksi
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
            <p className="text-sm text-gray-500">Modal ini akan tertutup secara otomatis...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleAttemptClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        if (step === 'qris-display') {
          e.preventDefault();
        }
      }}
      >
        <DialogHeader>
          <DialogTitle>
            {step === 'success' ? 'Pembayaran Selesai' : 'Detail Pembayaran'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
        <ConfirmDialog
          open={isCancelModalOpen}
          onOpenChange={setCancelModalOpen}
          title="Batalkan Transaksi"
          description="Apakah Anda yakin ingin membatalkan transaksi ini? Tindakan ini tidak dapat diurungkan."
          confirmText="Ya, Batalkan"
          cancelText="Lanjutkan Pembayaran"
          variant="destructive"
          onConfirm={async () => {
            if (step === 'qris-display' && currentTransactionId) {
              const success = await handleCancelTransaction(currentTransactionId);
              if (success) {
                handleConfirmClose();
              }
            } else {
              handleConfirmClose();
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
