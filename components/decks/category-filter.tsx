"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selectedCategory === "all" ? "default" : "outline"}
        className={cn(
          "cursor-pointer hover:bg-primary/80 transition-colors",
          selectedCategory === "all" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onCategoryChange("all")}
      >
        Tất cả
      </Badge>

      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={cn(
            "cursor-pointer hover:bg-primary/80 transition-colors",
            selectedCategory === category &&
              "bg-primary text-primary-foreground"
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Badge>
      ))}

      {categories.length === 0 && selectedCategory === "all" && (
        <p className="text-sm text-muted-foreground">
          Chưa có danh mục nào. Tạo deck đầu tiên để bắt đầu!
        </p>
      )}
    </div>
  );
}
