import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ChatInterfaceSettingsContentProps {
  chatbotId: string;
}

export function ChatInterfaceSettingsContent({}: ChatInterfaceSettingsContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Chat Interface</h2>
        <p className="text-muted-foreground">Customize chat interface appearance and behavior.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
            <Input id="welcome-message" defaultValue="Olá! Como posso ajudá-lo hoje?" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="placeholder-text">Texto do Placeholder</Label>
            <Input id="placeholder-text" defaultValue="Digite sua mensagem..." />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mostrar Avatar</Label>
              <p className="text-sm text-muted-foreground">Exibe avatar do chatbot nas mensagens</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar Configurações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
