"use client";

import { CategoryManagement } from '@/components/admin/category-management';

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <CategoryManagement />
      </div>
    </div>
  );
}