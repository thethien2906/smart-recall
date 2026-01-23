"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface DeckSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function DeckSearch({
  onSearch,
  placeholder = "Tìm kiếm bộ thẻ...",
}: DeckSearchProps) {
  const [query, setQuery] = useState("");

  // Debounce search - chỉ gọi sau khi user dừng gõ 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
