"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuthService } from '@/lib/auth';
import { AlertCircle, Coffee, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const user = await AuthService.login(email, password);
      if (user) {
        setSuccessMessage('Login berhasil! Mengarahkan...');
        toast.success('Login berhasil!', {
          description: `Selamat datang kembali, ${user.name}. Anda akan diarahkan...`,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
        setTimeout(() => {
          if (user.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/cashier');
          }
        }, 1500);
      } else {
        setError('Email atau password yang Anda masukkan salah.');
        toast.error('Login Gagal', {
          description: 'Silakan periksa kembali email dan password Anda.',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
      toast.error('Login Gagal', {
        description: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary rounded-full text-white">
              <Coffee className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            POS System Login
          </CardTitle>
          <CardDescription className="text-gray-500">
            Selamat datang kembali! Silakan masuk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-all duration-300 focus:border-primary focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}

            <Button type="submit" className="w-full font-semibold py-3" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}