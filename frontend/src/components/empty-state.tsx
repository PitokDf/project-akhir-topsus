import { type LucideIcon } from 'lucide-react';

export function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-80 rounded-lg bg-slate-100/80 p-8">
            <Icon className="h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <p className="text-slate-500 mt-1 max-w-sm">{description}</p>
        </div>
    );
}