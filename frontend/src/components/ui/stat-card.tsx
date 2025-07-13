import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideProps } from "lucide-react";

// Definisikan tipe props untuk komponen kita
interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    // Kita akan menerima komponen ikon sebagai prop
    icon: React.ComponentType<LucideProps>;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}