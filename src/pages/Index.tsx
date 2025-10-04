import { useState } from "react";
import { Hero } from "@/components/Hero";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    toast.success("Search initiated", {
      description: `Analyzing "${query}" across 608 publications...`,
    });
    // TODO: Implement actual search functionality
  };

  return (
    <div className="min-h-screen">
      <Hero onSearch={handleSearch} />
    </div>
  );
};

export default Index;
