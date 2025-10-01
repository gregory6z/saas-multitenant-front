import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GeneralSettingsContentProps {
  chatbotId: string;
}

export function GeneralSettingsContent({ chatbotId }: GeneralSettingsContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">General Settings</h2>
        <p className="text-muted-foreground">Basic chatbot configuration and general settings.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="chatbot-name">Nome do Chatbot</Label>
            <Input id="chatbot-name" defaultValue={`Chatbot ${chatbotId}`} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="chatbot-description">Descrição</Label>
            <Input id="chatbot-description" placeholder="Descreva o propósito do seu chatbot..." />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chatbot Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Permite que o chatbot responda mensagens
              </p>
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
