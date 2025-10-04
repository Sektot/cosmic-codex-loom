import { Brain, Database, Network } from "lucide-react";
import { SearchBar } from "./SearchBar";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-6">
          {/* Main title with glow effect */}
          <h1 className="text-5xl md:text-7xl font-bold glow-text font-mono mb-4">
            SPACE BIOLOGY
            <br />
            <span className="text-accent">KNOWLEDGE ENGINE</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore decades of NASA bioscience research with AI-powered insights
            and interactive knowledge graphs
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="circuit-frame px-6 py-3 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm">AI Analysis</span>
              </div>
            </div>
            <div className="circuit-frame px-6 py-3 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm">608+ Publications</span>
              </div>
            </div>
            <div className="circuit-frame px-6 py-3 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm">Knowledge Graphs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <SearchBar onSearch={onSearch} />

        {/* Pulse indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-3 h-3 rounded-full bg-primary pulse-necron" />
        </div>
      </div>
    </div>
  );
};
