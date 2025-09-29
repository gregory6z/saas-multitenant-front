import { Brain, MessageSquare, Shield, User } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingsContentProps {
  chatbotId: string;
}

export function SettingsContent({ chatbotId }: SettingsContentProps) {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as preferências e comportamento do seu chatbot {chatbotId}.
          </p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["general", "ai", "chat-interface", "security"]}
          className="space-y-4"
        >
          {/* General Settings */}
          <AccordionItem value="general">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Geral</h3>
                    <p className="text-sm text-muted-foreground">
                      Configurações básicas do chatbot
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="chatbot-name">Nome do Chatbot</Label>
                    <Input id="chatbot-name" defaultValue={`Chatbot ${chatbotId}`} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="chatbot-description">Descrição</Label>
                    <Input
                      id="chatbot-description"
                      placeholder="Descreva o propósito do seu chatbot..."
                    />
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
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* AI Settings */}
          <AccordionItem value="ai">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Configurações do modelo de inteligência artificial
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0 space-y-4">
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
                      <p className="text-sm text-muted-foreground">
                        Permite respostas mais criativas
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Chat Interface Settings */}
          <AccordionItem value="chat-interface">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Interface do Chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalize a aparência e comportamento do chat
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0 space-y-4">
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
                      <p className="text-sm text-muted-foreground">
                        Exibe avatar do chatbot nas mensagens
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Security Settings */}
          <AccordionItem value="security">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Segurança</h3>
                    <p className="text-sm text-muted-foreground">
                      Configurações de segurança e privacidade
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Filtro de Conteúdo</Label>
                      <p className="text-sm text-muted-foreground">
                        Bloqueia conteúdo inapropriado
                      </p>
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
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  );
}
