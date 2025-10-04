import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Publication } from "@/types/publication";
import { PublicationCard } from "@/components/PublicationCard";
import { PublicationFilters } from "@/components/PublicationFilters";
import { SearchBar } from "@/components/SearchBar";
import { NecronButton } from "@/components/NecronButton";
import { Database, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    yearRange: [null, null] as [number | null, number | null],
    organisms: [] as string[],
    researchArea: [] as string[],
    experimentType: [] as string[],
  });
  const [selectedPublication, setSelectedPublication] = useState<string | null>(null);

  // Fetch publications count
  const { data: count } = useQuery({
    queryKey: ["publications-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("publications")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  // Fetch publications
  const { data: publications, isLoading } = useQuery({
    queryKey: ["publications", searchQuery, filters],
    queryFn: async () => {
      let query = supabase.from("publications").select("*");

      // Apply search
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters.yearRange[0]) {
        query = query.gte("year", filters.yearRange[0]);
      }
      if (filters.yearRange[1]) {
        query = query.lte("year", filters.yearRange[1]);
      }
      if (filters.organisms.length > 0) {
        query = query.overlaps("organisms", filters.organisms);
      }
      if (filters.researchArea.length > 0) {
        query = query.in("research_area", filters.researchArea);
      }

      query = query.order("year", { ascending: false }).limit(50);

      const { data, error } = await query;
      if (error) throw error;
      return data as Publication[];
    },
  });

  // Fetch available filter options
  const { data: filterOptions } = useQuery({
    queryKey: ["filter-options"],
    queryFn: async () => {
      const { data } = await supabase.from("publications").select("organisms, research_area");

      const organisms = new Set<string>();
      const researchAreas = new Set<string>();

      data?.forEach((pub) => {
        pub.organisms?.forEach((o: string) => organisms.add(o));
        if (pub.research_area) researchAreas.add(pub.research_area);
      });

      return {
        organisms: Array.from(organisms).sort(),
        researchAreas: Array.from(researchAreas).sort(),
        experimentTypes: [],
      };
    },
  });

  // Import publications
  const importPublications = async () => {
    try {
      toast.loading("Importing publications from GitHub...", { id: "import" });
      
      const { data, error } = await supabase.functions.invoke("import-publications");

      if (error) throw error;

      toast.success(`Successfully imported ${data.imported} publications!`, { id: "import" });
      window.location.reload();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import publications", { id: "import" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-mono glow-text">
                Publication Explorer
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {count !== undefined && (
                <span className="text-sm text-muted-foreground font-mono">
                  {count} publications indexed
                </span>
              )}
              
              {count === 0 && (
                <NecronButton onClick={importPublications}>
                  <Download className="w-4 h-4 mr-2" />
                  Import Data
                </NecronButton>
              )}
            </div>
          </div>

          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {filterOptions && (
              <PublicationFilters
                filters={filters}
                onFilterChange={setFilters}
                availableFilters={filterOptions}
              />
            )}
          </div>

          {/* Publications Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : publications && publications.length > 0 ? (
              <div className="grid gap-6">
                {publications.map((pub) => (
                  <PublicationCard
                    key={pub.id}
                    publication={pub}
                    onSelect={setSelectedPublication}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-mono">
                  {count === 0
                    ? "No publications imported yet. Click 'Import Data' to get started."
                    : "No publications found. Try adjusting your search or filters."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
