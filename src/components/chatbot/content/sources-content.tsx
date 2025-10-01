import { Database, FileText, Globe, MoreHorizontal, Plus, Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SourcesContentProps {
  chatbotId: string;
}

export function SourcesContent({ chatbotId }: SourcesContentProps) {
  // Mock data - futuramente virá da API
  const sources = {
    files: [
      {
        id: "1",
        name: "manual-produto.pdf",
        size: "2.3 MB",
        type: "PDF",
        lastModified: "2024-01-15",
      },
      {
        id: "2",
        name: "faq-clientes.docx",
        size: "856 KB",
        type: "DOCX",
        lastModified: "2024-01-14",
      },
      {
        id: "3",
        name: "politicas-empresa.txt",
        size: "45 KB",
        type: "TXT",
        lastModified: "2024-01-13",
      },
    ],
    websites: [
      {
        id: "1",
        url: "https://exemplo.com/sobre",
        title: "Página Sobre Nós",
        lastCrawled: "2024-01-15",
      },
      {
        id: "2",
        url: "https://exemplo.com/servicos",
        title: "Nossos Serviços",
        lastCrawled: "2024-01-14",
      },
    ],
    knowledgeBases: [
      { id: "1", name: "Base de Conhecimento Principal", sources: 15, lastUpdated: "2024-01-15" },
      { id: "2", name: "FAQ Técnico", sources: 8, lastUpdated: "2024-01-12" },
    ],
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Sources</h1>
          <p className="text-muted-foreground">
            Gerencie as fontes de dados do seu chatbot {chatbotId}. Adicione, edite ou remova
            conteúdo para treinar seu assistente.
          </p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["files", "websites", "knowledge-bases"]}
          className="space-y-4"
        >
          {/* Files Section */}
          <AccordionItem value="files">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Arquivos</h3>
                    <p className="text-sm text-muted-foreground">
                      {sources.files.length} arquivos carregados
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Buscar arquivos..." className="pl-9 w-64" />
                        </div>
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Arquivo
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="select-all-files" />
                        <label
                          htmlFor="select-all-files"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Selecionar todos
                        </label>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Ordenar por:</span>
                        <Select defaultValue="name">
                          <SelectTrigger className="w-[120px] h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Nome</SelectItem>
                            <SelectItem value="date">Data</SelectItem>
                            <SelectItem value="size">Tamanho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {sources.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox id={`file-${file.id}`} />
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.type} • {file.size} • {file.lastModified}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Websites Section */}
          <AccordionItem value="websites">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Websites</h3>
                    <p className="text-sm text-muted-foreground">
                      {sources.websites.length} páginas indexadas
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Buscar páginas..." className="pl-9 w-64" />
                        </div>
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Website
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {sources.websites.map((website) => (
                        <div
                          key={website.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox id={`website-${website.id}`} />
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{website.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {website.url} • Última indexação: {website.lastCrawled}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Knowledge Bases Section */}
          <AccordionItem value="knowledge-bases">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Bases de Conhecimento</h3>
                    <p className="text-sm text-muted-foreground">
                      {sources.knowledgeBases.length} bases conectadas
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Buscar bases..." className="pl-9 w-64" />
                        </div>
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Conectar Base
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {sources.knowledgeBases.map((kb) => (
                        <div
                          key={kb.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox id={`kb-${kb.id}`} />
                            <Database className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{kb.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {kb.sources} fontes • Atualizado em {kb.lastUpdated}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
