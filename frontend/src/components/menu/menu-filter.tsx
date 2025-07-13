import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Category } from "@/lib/types";

interface MenuFiltersProps {
    searchTerm: string;
    selectedCategory: string;
    categories: Category[];
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

export function MenuFilters({ searchTerm, selectedCategory, categories, onSearchChange, onCategoryChange }: MenuFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Cari nama menu..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={selectedCategory} onValueChange={onCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}