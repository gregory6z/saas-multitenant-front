import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AISettingsContentProps {
  chatbotId: string;
}

export function AISettingsContent({}: AISettingsContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">AI Settings</h2>
        <p className="text-muted-foreground">
          Configure artificial intelligence model settings and behavior.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="ai-instructions">Instruções da IA</Label>
            <textarea
              id="ai-instructions"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Instruções sobre como a IA deve se comportar..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Criativo</Label>
              <p className="text-sm text-muted-foreground">Permite respostas mais criativas</p>
            </div>
            <Switch />
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
