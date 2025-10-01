import { Calendar, ChevronRight, Database, FileText, Plus, Search } from "lucide-react";
import { useState } from "react";
import { SourcesList } from "@/components/shared/sources-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface KnowledgeContentProps {
  mode: "knowledge-base" | "chatbot";
}

export function KnowledgeContent({ mode }: KnowledgeContentProps) {
  const entity = mode === "chatbot" ? "chatbot" : "new knowledge base";
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([]);

  // Mock data for existing knowledge bases
  const availableKnowledgeBases = [
    {
      id: "kb-1",
      name: "Product Documentation",
      description: "Complete documentation for all products",
      sourceCount: 45,
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "kb-2",
      name: "Customer Support FAQ",
      description: "Frequently asked questions and support articles",
      sourceCount: 23,
      createdAt: "2024-01-10",
      status: "active",
    },
    {
      id: "kb-3",
      name: "Company Policies",
      description: "Internal policies and procedures",
      sourceCount: 12,
      createdAt: "2024-01-08",
      status: "active",
    },
  ];

  const handleToggleSelection = (kbId: string) => {
    setSelectedKnowledgeBases((prev) =>
      prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId]
    );
  };

  const handleAssociateSelected = () => {
    console.log("Associating knowledge bases:", selectedKnowledgeBases);
    // Here would be the logic to associate selected knowledge bases
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Knowledge Bases</h2>
            <p className="text-muted-foreground">
              Use existing knowledge bases as sources for your {entity}
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
            Learn more
          </Button>
        </div>

        {/* Selection Actions */}
        {selectedKnowledgeBases.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedKnowledgeBases.length} knowledge base
                    {selectedKnowledgeBases.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedKnowledgeBases([])}>
                    Clear selection
                  </Button>
                  <Button size="sm" onClick={handleAssociateSelected}>
                    Associate selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Knowledge Bases */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available Knowledge Bases</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search knowledge bases..." className="pl-9 w-64" />
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create new
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {availableKnowledgeBases.map((kb) => (
                  <div
                    key={kb.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                      selectedKnowledgeBases.includes(kb.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-border"
                    }`}
                    onClick={() => handleToggleSelection(kb.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedKnowledgeBases.includes(kb.id)}
                            onCheckedChange={() => handleToggleSelection(kb.id)}
                            className="mr-3"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Database className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{kb.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {kb.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{kb.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {kb.sourceCount} sources
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created {kb.createdAt}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Associated Knowledge Bases section */}
        <SourcesList title="Associated Knowledge Bases" searchPlaceholder="Search associated...">
          {/* Empty state or associated knowledge bases list would go here */}
          <div className="mt-8 text-center py-8 text-muted-foreground">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No knowledge bases associated yet</p>
          </div>
        </SourcesList>
      </div>
    </div>
  );
}
