import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { NecronButton } from "@/components/NecronButton";
import { Database, Brain, Network } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/explorer?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      <Hero onSearch={handleSearch} />
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="circuit-frame bg-card p-8 text-center space-y-4 hover:bg-card/80 transition-all">
            <Database className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold font-mono">Publication Explorer</h3>
            <p className="text-muted-foreground text-sm">
              Search and filter 608+ NASA bioscience publications with advanced filtering
            </p>
            <NecronButton onClick={() => navigate("/explorer")}>
              Explore Database
            </NecronButton>
          </div>

          <div className="circuit-frame bg-card p-8 text-center space-y-4 hover:bg-card/80 transition-all">
            <Brain className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold font-mono">AI Assistant</h3>
            <p className="text-muted-foreground text-sm">
              Chat with an AI expert about space biology research and findings
            </p>
            <NecronButton onClick={() => navigate("/assistant")}>
              Start Chatting
            </NecronButton>
          </div>

          <div className="circuit-frame bg-card p-8 text-center space-y-4 hover:bg-card/80 transition-all">
            <Network className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold font-mono">Knowledge Graph</h3>
            <p className="text-muted-foreground text-sm">
              Visualize connections between research topics and discoveries
            </p>
            <NecronButton onClick={() => navigate("/graph")}>
              View Graph
            </NecronButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
