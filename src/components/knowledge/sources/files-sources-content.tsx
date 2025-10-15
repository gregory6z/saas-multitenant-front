import { FileText, MoreHorizontal, Plus, Search } from "lucide-react";

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

interface FilesSourcesContentProps {
  mode: "knowledge-base" | "chatbot";
}

export function FilesSourcesContent({ mode }: FilesSourcesContentProps) {
  const entity = mode === "chatbot" ? "chatbot" : "knowledge base";

  // Mock data - futuramente virá da API
  const files = [
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Files</h2>
        <p className="text-muted-foreground">
          Manage your file sources for the {entity}. Upload and organize documents to train your AI
          assistant.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar arquivos..." className="pl-9 w-64" />
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4" />
                Adicionar Arquivo
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="select-all-files" />
                <label htmlFor="select-all-files" className="text-sm font-medium cursor-pointer">
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
              {files.map((file) => (
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
      </Card>
    </div>
  );
}
