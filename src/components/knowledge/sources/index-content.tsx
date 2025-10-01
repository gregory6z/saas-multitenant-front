import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface IndexContentProps {
  mode: "knowledge-base" | "chatbot";
}

export function IndexContent({ mode }: IndexContentProps) {
  const basePath =
    mode === "chatbot" ? "/dashboard/chatbots/create" : "/dashboard/knowledge-base/create";
  const title = mode === "chatbot" ? "chatbot" : "knowledge base";

  return (
    <div className="flex-1 p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Selecione uma fonte</h2>
      <p className="text-muted-foreground mb-6">
        Use o menu lateral para navegar entre os tipos de fontes para seu {title}
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link to={`${basePath}/files`}>Começar com Arquivos</Link>
        </Button>
      </div>
    </div>
  );
}
