'use client'

import { LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface HeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

// Fungsi helper untuk mendapatkan inisial nama
const getInitials = (name: string = '') => {
    return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

export default function Header({ title, subtitle, icon }: HeaderProps) {
    const router = useRouter();
    const [open, setIsOpen] = useState<boolean>(false)
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        return new Promise<void>((resolve) => {
            AuthService.logout();
            router.push('/login');
            resolve();
        });
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Bagian Kiri: Judul & Ikon (Reusable) */}
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="p-2 bg-primary text-primary-foreground rounded-lg hidden sm:block">
                                {icon}
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600 hidden md:block">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bagian Kanan: Menu Pengguna (Dropdown) */}
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.role}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setIsOpen(true);
                                    }}
                                >
                                    <LogOut className="h-4 w-4 mr-2 text-destructive" />
                                    <span className="text-destructive">Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                open={open}
                onOpenChange={(open) => {
                    setIsOpen(open);
                }}
                title="Logout"
                description="Apakah Anda yakin ingin keluar?"
                confirmText="Ya, Logout"
                onConfirm={handleLogout}
                cancelText="Tidak, Batal"
            />
        </header>
    );
}