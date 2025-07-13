import { AuthGuard } from "@/components/layout/auth-guard";
import Header from "@/components/layout/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard requiredRole="ADMIN">
            <div className="min-h-screen bg-gray-50">
                <Header
                    title="Point of Sale"
                    subtitle="Halaman Admin"
                />
                <div className="p-6">
                    {children}
                </div>
            </div>
        </AuthGuard>
    )
}