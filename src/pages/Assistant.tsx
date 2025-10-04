import { Brain, Home, Database, Network } from "lucide-react";
import { AIChat } from "@/components/AIChat";
import { useNavigate } from "react-router-dom";
import { NecronButton } from "@/components/NecronButton";

const Assistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold font-mono glow-text">
                  AI Research Assistant
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask questions about NASA space biology research
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NecronButton onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </NecronButton>
              <NecronButton onClick={() => navigate("/explorer")}>
                <Database className="w-4 h-4 mr-2" />
                Explorer
              </NecronButton>
              <NecronButton onClick={() => navigate("/graph")}>
                <Network className="w-4 h-4 mr-2" />
                Graph
              </NecronButton>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AIChat />

          <div className="mt-6 circuit-frame bg-card p-6">
            <h3 className="font-mono font-bold text-primary mb-3">Example Questions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• What are the main findings about plant growth in microgravity?</li>
              <li>• Which organisms have been most studied in space?</li>
              <li>• What are the knowledge gaps in radiation biology research?</li>
              <li>• How does spaceflight affect human cellular biology?</li>
              <li>• What experiments have been done on the International Space Station?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
