import { CheckCircle, Code, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WidgetContentProps {
  chatbotId: string;
}

export function WidgetContent({ chatbotId }: WidgetContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = generateEmbedCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateEmbedCode = () => {
    return `<script src="https://widget.multisaasweb.com/chatbot.js"></script>
<div id="chatbot-${chatbotId}"></div>
<script>
  ChatbotWidget.init({
    chatbotId: "${chatbotId}",
    containerId: "chatbot-${chatbotId}"
  });
</script>`;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 pt-4 md:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Widget</h1>
          <p className="text-muted-foreground">
            Configure e incorpore seu chatbot em websites e aplicações.
          </p>
        </div>
        {/* Embed Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Código de Incorporação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg font-mono text-sm text-slate-200 relative">
                <pre className="overflow-x-auto">{generateEmbedCode()}</pre>
              </div>
              <Button onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Código
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Como Instalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Copie o código acima</p>
                  <p className="text-sm text-muted-foreground">
                    Use o botão "Copiar Código" para copiar todo o snippet
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Cole no seu website</p>
                  <p className="text-sm text-muted-foreground">
                    Adicione o código antes da tag{" "}
                    <code className="bg-muted px-1 rounded text-xs">&lt;/body&gt;</code> do seu HTML
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Teste o widget</p>
                  <p className="text-sm text-muted-foreground">
                    Recarregue sua página e o chatbot aparecerá automaticamente
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Interface Intuitiva</h4>
                <p className="text-sm text-muted-foreground">Chat moderno e responsivo</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Carregamento Rápido</h4>
                <p className="text-sm text-muted-foreground">Widget otimizado e leve</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Mobile First</h4>
                <p className="text-sm text-muted-foreground">Funciona em todos os dispositivos</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Personalizável</h4>
                <p className="text-sm text-muted-foreground">Se adapta ao seu design</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
