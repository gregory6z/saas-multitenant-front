import { Database, FileText, Globe, MoreHorizontal, Search, Type, Upload } from "lucide-react";
import { useState } from "react";
import { ChatbotCreationSidebar } from "@/components/chatbot/chatbot-creation-sidebar";
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
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";

interface KnowledgeSourceCreatorProps {
  mode?: "knowledge-base" | "chatbot";
  onComplete?: (knowledgeBaseId: string) => void;
}

export function KnowledgeSourceCreator({
  mode = "knowledge-base",
  onComplete,
}: KnowledgeSourceCreatorProps) {
  const [activeSection] = useState("files");

  // Mock uploaded files data
  const uploadedFiles = [
    { id: 1, name: "1 File", size: "3 KB", type: "file" },
    { id: 2, name: "1 Text File", size: "5 B", type: "text" },
  ];

  const handleCreate = () => {
    // Mock creation - futuramente será uma API call
    const mockKnowledgeBaseId = `kb_${Date.now()}`;

    if (mode === "chatbot") {
      // Criar knowledge base + chatbot automaticamente
      console.log("Creating knowledge base + chatbot...");
      onComplete?.(mockKnowledgeBaseId);
    } else {
      // Apenas criar knowledge base
      console.log("Creating knowledge base only...");
      onComplete?.(mockKnowledgeBaseId);
    }
  };

  const getButtonText = () => {
    return mode === "chatbot" ? "Create Knowledge Base + Chatbot" : "Create Knowledge Base";
  };

  const getInfoMessage = () => {
    if (mode === "chatbot") {
      return {
        text: "💡 A knowledge base will be created and a chatbot will be automatically generated",
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-800",
      };
    }
    return {
      text: "💡 After creating the knowledge base, you can create a chatbot",
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
    };
  };

  const infoMessage = getInfoMessage();

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <SidebarProvider>
        <ChatbotCreationSidebar mode={mode} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Content Area */}
            <div className="flex-1 p-8">
              {activeSection === "files" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Files</h2>
                    <p className="text-muted-foreground">
                      Upload documents to train your AI. Extract text from PDFs, DOCX, and TXT
                      files.
                    </p>
                  </div>

                  {/* Add files section */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Add files</h3>
                        <Button variant="outline" size="sm">
                          Learn more
                        </Button>
                      </div>

                      {/* Warning message */}
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                        <p className="text-sm text-orange-800">
                          If you are uploading a PDF, make sure you can select/highlight the text.
                        </p>
                      </div>

                      {/* Drag & Drop Area */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground mb-2">
                          Drag & drop files here, or click to select files
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supported file types: pdf, doc, docx, txt
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* File sources section */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">File sources</h3>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-9 w-64" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Checkbox id="select-all-legacy" />
                          <label
                            htmlFor="select-all-legacy"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Select all
                          </label>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Sort by:</span>
                          <Select defaultValue="default">
                            <SelectTrigger className="w-[120px] h-8 text-sm border-none bg-transparent focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="size">Size</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* File list */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Checkbox id="file-legacy-1" />
                            <label htmlFor="file-legacy-1" className="text-sm cursor-pointer">
                              74e9c2f2-0e26-4cf9-b977-58e1d020550d.pdf
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">3 KB</span>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "text" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Text</h2>
                    <p className="text-muted-foreground">
                      Add custom text content for your knowledge base
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Type className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Text Content</h3>
                      <p className="text-muted-foreground">
                        Text input interface will be implemented here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "websites" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Websites</h2>
                    <p className="text-muted-foreground">
                      Import content from websites and web pages
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Website Import</h3>
                      <p className="text-muted-foreground">
                        Website import interface will be implemented here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "knowledge" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Knowledge Bases</h2>
                    <p className="text-muted-foreground">
                      Connect existing knowledge bases and databases
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Knowledge Base Integration</h3>
                      <p className="text-muted-foreground">
                        Knowledge base integration will be implemented here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Sources Sidebar */}
            <div className="w-80 bg-muted/30 border-l p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sources</h3>
                </div>

                {/* Uploaded files list */}
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total size */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Total size</span>
                    <span className="text-muted-foreground">3 KB / 400 KB</span>
                  </div>

                  {/* Create button - dinâmico baseado no mode */}
                  <Button className="w-full" variant="default" onClick={handleCreate}>
                    {getButtonText()}
                  </Button>

                  {/* Info message - dinâmica baseada no mode */}
                  <div className={`${infoMessage.bgColor} border rounded-lg p-3`}>
                    <p className={`text-xs ${infoMessage.textColor}`}>{infoMessage.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
