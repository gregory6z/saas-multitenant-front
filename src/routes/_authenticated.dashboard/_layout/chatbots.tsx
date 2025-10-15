import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, MoreHorizontal, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for chatbots
const chatbots = [
  {
    id: "1",
    name: "certificado NODE js.pdf",
    lastTrained: "Last trained 19 minutes ago",
    type: "document",
  },
  {
    id: "2",
    name: "Customer Support Bot",
    lastTrained: "Last trained 2 hours ago",
    type: "agent",
  },
  {
    id: "3",
    name: "Sales Assistant",
    lastTrained: "Last trained 1 day ago",
    type: "agent",
  },
];

export const Route = createFileRoute("/_authenticated/dashboard/_layout/chatbots")({
  component: ChatbotsPage,
});

function ChatbotsPage() {
  const { t } = useTranslation("common");

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("chatbots.title")}</h1>
        <Button >
          <Link to="/dashboard/chatbots/create">
            <span>
              <Plus className="w-4 h-4" />
              {t("chatbots.newAgent")}
            </span>
          </Link>
        </Button>
      </div>

      {/* Chatbots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chatbots.map((chatbot) => (
          <ChatbotCard key={chatbot.id} chatbot={chatbot} />
        ))}
      </div>
    </div>
  );
}

function ChatbotCard({ chatbot }: { chatbot: (typeof chatbots)[0] }) {
  const { t } = useTranslation("common");
  return (
    <Link to="/dashboard/chatbots/$id/playground" params={{ id: chatbot.id }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Gradient Header with Icon */}
        <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 relative flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <FileText className="w-8 h-8 text-white" />
          </div>

          {/* Options Menu */}
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t("chatbots.actions.edit")}</DropdownMenuItem>
                <DropdownMenuItem>{t("chatbots.actions.duplicate")}</DropdownMenuItem>
                <DropdownMenuItem>{t("chatbots.actions.share")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  {t("chatbots.actions.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-1 truncate">{chatbot.name}</h3>
          <p className="text-sm text-muted-foreground">{chatbot.lastTrained}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
