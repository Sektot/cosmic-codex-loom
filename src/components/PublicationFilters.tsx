import { Filter, X } from "lucide-react";
import { NecronButton } from "./NecronButton";

interface FilterState {
  yearRange: [number | null, number | null];
  organisms: string[];
  researchArea: string[];
  experimentType: string[];
}

interface PublicationFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFilters: {
    organisms: string[];
    researchAreas: string[];
    experimentTypes: string[];
  };
}

export const PublicationFilters = ({
  filters,
  onFilterChange,
  availableFilters,
}: PublicationFiltersProps) => {
  const hasActiveFilters = 
    filters.organisms.length > 0 ||
    filters.researchArea.length > 0 ||
    filters.experimentType.length > 0 ||
    filters.yearRange[0] !== null ||
    filters.yearRange[1] !== null;

  const clearFilters = () => {
    onFilterChange({
      yearRange: [null, null],
      organisms: [],
      researchArea: [],
      experimentType: [],
    });
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    onFilterChange({ ...filters, [category]: updated });
  };

  return (
    <div className="circuit-frame bg-card p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between sticky top-0 bg-card pb-4 z-10">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-mono font-bold text-lg">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <NecronButton size="sm" variant="ghost" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </NecronButton>
        )}
      </div>

      {/* Year Range */}
      <div className="space-y-2">
        <label className="text-sm font-mono text-muted-foreground font-semibold">📅 Year Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.yearRange[0] || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              yearRange: [e.target.value ? parseInt(e.target.value) : null, filters.yearRange[1]]
            })}
            className="flex-1 bg-muted px-3 py-2 text-sm font-mono border border-border focus:border-primary outline-none rounded"
          />
          <input
            type="number"
            placeholder="To"
            value={filters.yearRange[1] || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              yearRange: [filters.yearRange[0], e.target.value ? parseInt(e.target.value) : null]
            })}
            className="flex-1 bg-muted px-3 py-2 text-sm font-mono border border-border focus:border-primary outline-none rounded"
          />
        </div>
      </div>

      {/* Research Areas */}
      {availableFilters.researchAreas.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground font-semibold">🔬 Research Area</label>
          <div className="space-y-1">
            {availableFilters.researchAreas.map((area) => (
              <button
                key={area}
                onClick={() => toggleFilter('researchArea', area)}
                className={`w-full px-3 py-2 text-xs font-mono transition-all text-left rounded ${
                  filters.researchArea.includes(area)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-foreground border-border hover:border-primary'
                } border`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Organisms */}
      {availableFilters.organisms.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground font-semibold">🧬 Organisms</label>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
            {availableFilters.organisms.map((organism) => (
              <button
                key={organism}
                onClick={() => toggleFilter('organisms', organism)}
                className={`w-full px-3 py-2 text-xs font-mono transition-all text-left rounded ${
                  filters.organisms.includes(organism)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-foreground border-border hover:border-primary'
                } border`}
              >
                {organism}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Experiment Types */}
      {availableFilters.experimentTypes.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground font-semibold">🧪 Experiment Type</label>
          <div className="space-y-1">
            {availableFilters.experimentTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter('experimentType', type)}
                className={`w-full px-3 py-2 text-xs font-mono transition-all text-left rounded ${
                  filters.experimentType.includes(type)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-foreground border-border hover:border-primary'
                } border`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
