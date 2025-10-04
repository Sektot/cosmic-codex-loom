import { Search } from "lucide-react";
import { useState } from "react";
import { NecronButton } from "./NecronButton";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Search NASA bioscience publications..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative circuit-frame bg-card">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          />
        </div>
        <NecronButton type="submit" size="lg">
          Search
        </NecronButton>
      </div>
    </form>
  );
};
