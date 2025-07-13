'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

interface ManagementCardProps {
    icon: ComponentType<LucideProps>;
    iconBgColor: string;
    iconTextColor: string;
    title: string;
    description: string;
    content: string;
    buttonText: string;
    buttonVariant?: ButtonProps['variant'];
    href?: string;
}

export function ManagementCard({
    icon: Icon,
    iconBgColor,
    iconTextColor,
    title,
    description,
    content,
    buttonText,
    buttonVariant = 'outline',
    href,
}: ManagementCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <Card
            className={`hover:shadow-lg transition-shadow ${href ? 'cursor-pointer' : ''}`}
            onClick={handleClick}
        >
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className={`p-2 ${iconBgColor} rounded-lg`}>
                        <Icon className={`h-6 w-6 ${iconTextColor}`} />
                    </div>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                    {content}
                </p>
                <Button
                    className="w-full" // mt-auto dihapus
                    variant={buttonVariant}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    {buttonText}
                </Button>
            </CardContent>
            {/* --- AKHIR PERUBAHAN --- */}
        </Card>
    );
}