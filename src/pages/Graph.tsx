import { useState } from "react";
import { Network } from "lucide-react";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";

const Graph = () => {
  const [selectedPublication, setSelectedPublication] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-mono glow-text">
                Knowledge Graph
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore connections between NASA bioscience research
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <KnowledgeGraph selectedPublicationId={selectedPublication} />
        </div>

        <div className="mt-6 circuit-frame bg-card p-6">
          <h3 className="font-mono font-bold text-primary mb-3">Graph Legend</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              • <span className="text-primary">Node size</span> represents publication importance
            </p>
            <p className="text-muted-foreground">
              • <span className="text-accent">Link thickness</span> represents connection strength
            </p>
            <p className="text-muted-foreground">
              • <span className="text-foreground">Connections</span> based on shared keywords, organisms, and research areas
            </p>
            <p className="text-muted-foreground">
              • <span className="text-foreground">Zoom</span> with mouse wheel, <span className="text-foreground">drag</span> to pan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
