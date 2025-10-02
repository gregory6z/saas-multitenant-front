import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Database,
  FileText,
  Globe,
  Layers,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/knowledge-base")({
  component: KnowledgeBasePage,
});

// Mock data for knowledge bases
const knowledgeBases = [
  {
    id: "1",
    name: "Customer Support KB",
    description: "Base de conhecimento completa para suporte ao cliente com FAQs e procedimentos",
    sourceCount: 15,
    lastUpdated: "2 days ago",
    type: "mixed" as const,
    size: "2.3 MB",
  },
  {
    id: "2",
    name: "Product Documentation",
    description: "Documentação técnica completa de todos os produtos e funcionalidades",
    sourceCount: 8,
    lastUpdated: "1 week ago",
    type: "documents" as const,
    size: "1.8 MB",
  },
  {
    id: "3",
    name: "FAQ Website",
    description: "Perguntas frequentes extraídas do site principal e portais de ajuda",
    sourceCount: 25,
    lastUpdated: "3 days ago",
    type: "website" as const,
    size: "1.2 MB",
  },
  {
    id: "4",
    name: "Training Materials",
    description: "Materiais de treinamento interno e guias de onboarding",
    sourceCount: 12,
    lastUpdated: "5 days ago",
    type: "documents" as const,
    size: "3.1 MB",
  },
];

function KnowledgeBasePage() {
  const { t } = useTranslation("common");

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.knowledgeBase")}</h1>
          <p className="text-muted-foreground">{t("knowledgeBase.manageDescription")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search knowledge bases..." className="pl-9 w-64" />
          </div>
          <Button asChild>
            <Link to="/dashboard/knowledge-base/create">
              <Plus className="w-4 h-4 mr-2" />
              {t("knowledgeBase.createButton")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{knowledgeBases.length}</p>
                <p className="text-sm text-muted-foreground">{t("knowledgeBase.totalBases")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {knowledgeBases.reduce((acc, kb) => acc + kb.sourceCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">{t("knowledgeBase.totalSources")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">8.4 MB</p>
                <p className="text-sm text-muted-foreground">{t("knowledgeBase.totalSize")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Bases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBases.map((kb) => (
          <KnowledgeBaseCard key={kb.id} knowledgeBase={kb} />
        ))}
      </div>
    </div>
  );
}

function KnowledgeBaseCard({ knowledgeBase }: { knowledgeBase: (typeof knowledgeBases)[0] }) {
  const { t } = useTranslation("common");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "documents":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "website":
        return <Globe className="w-5 h-5 text-green-600" />;
      default:
        return <Layers className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "documents":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {t("knowledgeBase.types.documents")}
          </Badge>
        );
      case "website":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {t("knowledgeBase.types.website")}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {t("knowledgeBase.types.mixed")}
          </Badge>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(knowledgeBase.type)}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{knowledgeBase.name}</CardTitle>
              {getTypeBadge(knowledgeBase.type)}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t("knowledgeBase.actions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("knowledgeBase.edit")}</DropdownMenuItem>
              <DropdownMenuItem>{t("knowledgeBase.duplicate")}</DropdownMenuItem>
              <DropdownMenuItem>{t("knowledgeBase.export")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                {t("knowledgeBase.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{knowledgeBase.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>
              {knowledgeBase.sourceCount} {t("knowledgeBase.sources")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{knowledgeBase.size}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            {t("knowledgeBase.lastUpdated")} {knowledgeBase.lastUpdated}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
