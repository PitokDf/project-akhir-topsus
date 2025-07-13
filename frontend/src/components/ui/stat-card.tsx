import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, type LucideProps } from "lucide-react";

// Definisikan tipe props untuk komponen kita
interface StatCardProps {
    title: string;
    value: string | number;
    trend?: string,
    trendColor?: string,
    note?: string,
    icon: React.ComponentType<LucideProps>;
}
export const StatCard = ({ icon: Icon, title, value, trend, trendColor, note }: StatCardProps) => (
    <Card>
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    <div className={`flex items-center text-sm ${trendColor} mt-1`}>
                        {trend && trend.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {trend && `${trend} dari kemarin`}
                    </div>
                    {note && <p className="text-xs text-yellow-600 mt-1">{note}</p>}
                </div>
                {trend && <Icon className={`h-8 w-8 ${trendColor}`} />}
            </div>
        </CardContent>
    </Card>
);