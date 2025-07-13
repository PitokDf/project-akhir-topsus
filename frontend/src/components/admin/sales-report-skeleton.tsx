import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SalesReportSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-6 w-full" /></div>
                        <div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-6 w-full" /></div>
                        <div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-6 w-full" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}