import {
  Bold,
  ChevronUp,
  Italic,
  Link2,
  List,
  ListOrdered,
  Smile,
  Strikethrough,
  Type,
} from "lucide-react";
import { useState } from "react";
import { SourcesList } from "@/components/shared/sources-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TextContentProps {
  mode: "knowledge-base" | "chatbot";
}

export function TextContent({}: TextContentProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Text</h2>
            <p className="text-muted-foreground">
              Add plain text-based sources to train your AI Agent with precise information.
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
            Learn more
          </Button>
        </div>

        {/* Add text snippet card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <h3 className="text-lg font-medium">Add text snippet</h3>
                <ChevronUp
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-0" : "rotate-180"}`}
                />
              </div>

              {isExpanded && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                    <Input placeholder="Ex: Refund requests" className="w-full" />
                  </div>

                  <div>
                    <div className="space-y-3">
                      {/* Toolbar */}
                      <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/10">
                        <div className="flex items-center gap-1">
                          <Select defaultValue="text">
                            <SelectTrigger className="w-16 h-8 text-sm border-none bg-transparent">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">T</SelectItem>
                              <SelectItem value="heading">H</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="w-px h-4 bg-border mx-2" />
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Strikethrough className="w-4 h-4" />
                          </Button>
                          <div className="w-px h-4 bg-border mx-2" />
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <List className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ListOrdered className="w-4 h-4" />
                          </Button>
                          <div className="w-px h-4 bg-border mx-2" />
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Link2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">0 B</span>
                      </div>

                      {/* Text area */}
                      <Textarea
                        placeholder="Enter your text"
                        className="min-h-[180px] resize-none border border-border focus-visible:ring-0 text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Add text snippet</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Text sources section */}
        <SourcesList title="Text sources" searchPlaceholder="Search...">
          {/* Empty state or text sources list would go here */}
          <div className="mt-8 text-center py-8 text-muted-foreground">
            <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No text sources added yet</p>
          </div>
        </SourcesList>
      </div>
    </div>
  );
}
