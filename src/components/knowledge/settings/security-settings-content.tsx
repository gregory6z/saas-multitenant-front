import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsContentProps {
  chatbotId: string;
}

export function SecuritySettingsContent({}: SecuritySettingsContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Security Settings</h2>
        <p className="text-muted-foreground">
          Configure security and privacy settings for your chatbot.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Filtro de Conteúdo</Label>
              <p className="text-sm text-muted-foreground">Bloqueia conteúdo inapropriado</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Armazenar Conversas</Label>
              <p className="text-sm text-muted-foreground">Salva histórico para análise</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Limite de Taxa</Label>
              <p className="text-sm text-muted-foreground">Previne spam de mensagens</p>
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
