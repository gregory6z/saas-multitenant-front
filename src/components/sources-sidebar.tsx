import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SourcesSidebarProps {
  mode?: "knowledge-base" | "chatbot";
}

export function SourcesSidebar({ mode = "knowledge-base" }: SourcesSidebarProps) {
  // Mock uploaded files data
  const uploadedFiles = [
    { id: 1, name: "1 File", size: "3 KB", type: "file" },
    { id: 2, name: "1 Text File", size: "5 B", type: "text" },
  ];

  const handleKnowledgeBaseCreated = (knowledgeBaseId: string) => {
    console.log("Knowledge Base created with ID:", knowledgeBaseId);
    // Futuramente redirecionar para a página da knowledge base criada
  };

  const getButtonText = () => {
    return mode === "chatbot" ? "Create Knowledge Base + Chatbot" : "Create Knowledge Base";
  };

  const getInfoMessage = () => {
    if (mode === "chatbot") {
      return {
        text: "💡 A knowledge base will be created and a chatbot will be automatically generated",
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-800",
      };
    }
    return {
      text: "💡 After creating the knowledge base, you can create a chatbot",
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
    };
  };

  const infoMessage = getInfoMessage();

  return (
    <div className="w-80 bg-muted/30 border-l overflow-y-auto h-[calc(100vh-60px)] fixed right-0 top-[60px]">
      <div className="p-6 space-y-6 pb-12">
        <div>
          <h3 className="text-lg font-semibold mb-4">Sources</h3>
        </div>

        {/* Uploaded files list */}
        <div className="space-y-3">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-background"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{file.size}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Total size</span>
            <span className="text-muted-foreground">3 KB / 400 KB</span>
          </div>

          {/* Create button - dinâmico baseado no mode */}
          <Button
            className="w-full"
            variant="default"
            onClick={() => handleKnowledgeBaseCreated("mock-kb-id")}
          >
            {getButtonText()}
          </Button>

          {/* Info message - dinâmica baseada no mode */}
          <div className={`${infoMessage.bgColor} border rounded-lg p-3`}>
            <p className={`text-xs ${infoMessage.textColor}`}>{infoMessage.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
