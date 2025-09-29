import { Bot, FileText, RefreshCw, RotateCcw, Send, Smile } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

interface PlaygroundContentProps {
  chatbotId: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function PlaygroundContent({ chatbotId }: PlaygroundContentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! What can I help you with?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState([0]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simular resposta do bot
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Obrigado pela sua mensagem: "${inputMessage}". Esta é uma resposta simulada do chatbot ${chatbotId}.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex">
      {/* Model & Configuration Panel */}
      <div className="w-96 bg-background border-r h-full overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight">Model</h2>
          </div>

          <div className="space-y-8">
            {/* Agent Status */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground tracking-wide">
                Agent status
              </label>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium text-emerald-600">Trained</span>
              </div>
            </div>

            <Button className="w-full h-11 font-medium">Save to agent</Button>

            <div className="border-t my-8" />

            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground tracking-wide">
                  Temperature
                </label>
                <span className="text-sm font-semibold tabular-nums">{temperature[0]}</span>
              </div>
              <div className="space-y-3">
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reserved</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            <div className="border-t my-8" />

            {/* System prompt */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground tracking-wide">
                System prompt
              </label>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <span className="text-sm font-medium">AI agent</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground tracking-wide">
                Instructions
              </label>
              <div className="p-4 border rounded-lg bg-muted/20 text-sm text-muted-foreground max-h-40 overflow-y-auto leading-relaxed">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Role</h4>
                    <p className="text-xs leading-relaxed">
                      Primary Function: You are an AI chatbot who helps users with their inquiries,
                      issues and requests. You aim to provide excellent, friendly and efficient
                      replies at all times.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Constraints</h4>
                    <p className="text-xs leading-relaxed">
                      Your role is to listen attentively to the user, understand their needs, and do
                      your best to assist them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface with Mobile Design */}
      <div className="flex-1 relative">
        {/* Dotted Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Mobile Chat Container */}
        <div className="flex items-start justify-center h-full p-8 relative z-10">
          <div
            className="w-full max-w-md md:w-[450px] bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden relative z-20"
            style={{ height: "calc(100vh - 8rem)" }}
          >
            {/* Document Reference Header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    74e9c2f2-0e26-4cf9-b977-58e1d020550d.pdf
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      {message.sender === "bot" && message.id === "1" && (
                        <div className="mb-3 p-3 bg-background/80 border rounded-xl text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 mb-2">
                            <FileText className="w-3 h-3" />
                            <span className="font-medium">
                              74e9c2f2-0e26-4cf9-b977-58e1d020550d.pdf
                            </span>
                          </div>
                          <p className="text-foreground">Hi! What can I help you with?</p>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Powered by footer */}
            <div className="px-4 py-2 text-center border-t bg-muted/20">
              <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Bot className="w-3 h-3" />
                Powered by RagBoost
              </span>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="sm" className="p-2 rounded-full">
                  <Smile className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="rounded-full flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
