"use client";

import { MenuManagement } from '@/components/admin/menu-management';

export default function AdminMenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <MenuManagement />
      </div>
    </div>
  );
}