"use client";

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface UserActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export function UserActions({ onEdit, onDelete }: UserActionsProps) {
    return (
        <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}