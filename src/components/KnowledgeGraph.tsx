import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { supabase } from "@/integrations/supabase/client";
import { GraphNode, GraphLink } from "@/types/publication";
import { Loader2 } from "lucide-react";

interface KnowledgeGraphProps {
  selectedPublicationId?: string | null;
}

export const KnowledgeGraph = ({ selectedPublicationId }: KnowledgeGraphProps) => {
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const graphRef = useRef<any>();

  useEffect(() => {
    loadGraphData();
  }, []);

  useEffect(() => {
    if (selectedPublicationId && graphRef.current) {
      const node = graphData.nodes.find(n => n.id === selectedPublicationId);
      if (node) {
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(3, 1000);
      }
    }
  }, [selectedPublicationId]);

  const loadGraphData = async () => {
    try {
      setIsLoading(true);

      // Fetch publications (limit to first 100 for performance)
      const { data: pubs, error: pubError } = await supabase
        .from("publications")
        .select("id, title, year, research_area")
        .limit(100);

      if (pubError) throw pubError;

      // Fetch connections
      const pubIds = pubs?.map(p => p.id) || [];
      const { data: connections, error: connError } = await supabase
        .from("publication_connections")
        .select("*")
        .in("source_publication_id", pubIds)
        .in("target_publication_id", pubIds);

      if (connError) throw connError;

      // Transform to graph format
      const nodes: GraphNode[] = (pubs || []).map((pub) => ({
        id: pub.id,
        title: pub.title,
        year: pub.year || undefined,
        research_area: pub.research_area || undefined,
        val: 5, // Node size
      }));

      const links: GraphLink[] = (connections || []).map((conn) => ({
        source: conn.source_publication_id,
        target: conn.target_publication_id,
        type: conn.connection_type,
        strength: conn.strength,
      }));

      setGraphData({ nodes, links });
    } catch (error) {
      console.error("Failed to load graph data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-card circuit-frame">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground font-mono">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="circuit-frame bg-card overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-background/90 p-3 border border-border">
        <div className="space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Publications ({graphData.nodes.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-accent" />
            <span>Connections ({graphData.links.length})</span>
          </div>
        </div>
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={800}
        height={600}
        nodeLabel={(node: any) => node.title}
        nodeColor={(node: any) => 
          node.id === selectedPublicationId ? "hsl(var(--accent))" : "hsl(var(--primary))"
        }
        nodeRelSize={5}
        linkColor={() => "hsl(var(--accent))"}
        linkWidth={(link: any) => link.strength * 2}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        backgroundColor="hsl(var(--card))"
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.title;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px JetBrains Mono`;
          ctx.fillStyle = node.id === selectedPublicationId 
            ? "hsl(var(--accent))" 
            : "hsl(var(--primary))";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Add glow for selected node
          if (node.id === selectedPublicationId) {
            ctx.shadowColor = "hsl(var(--accent))";
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "hsl(var(--foreground))";
          if (globalScale > 2) {
            ctx.fillText(label.substring(0, 20) + "...", node.x, node.y + 10);
          }
        }}
      />
    </div>
  );
};
