
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

const SearchBar = ({ onSearch, initialValue = "", placeholder = "Cerca attività, corsi, eventi..." }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" className="bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]">
        Cerca
      </Button>
    </form>
  );
};

export default SearchBar;
