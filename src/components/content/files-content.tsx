import { FileText, MoreHorizontal, Upload } from "lucide-react";
import { SourcesList } from "@/components/shared/sources-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface FilesContentProps {
  mode: "knowledge-base" | "chatbot";
}

export function FilesContent({ mode }: FilesContentProps) {
  const entity = mode === "chatbot" ? "chatbot" : "knowledge base";

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Files</h2>
          <p className="text-muted-foreground">
            Upload documents to train your AI. Extract text from PDFs, DOCX, and TXT files for your{" "}
            {entity}.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Add files</h3>
                <Button variant="outline" size="sm">
                  Learn more
                </Button>
              </div>

              {/* Warning message */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
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
            </div>
          </CardContent>
        </Card>

        <SourcesList title="Uploaded Files" searchPlaceholder="Search files...">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Checkbox />
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">74e9c2f2-0e26-4cf9-b977-58e1d020550d.pdf</p>
                  <p className="text-xs text-muted-foreground">3 KB • Uploaded: 2024-01-15</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Checkbox />
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">company-handbook.docx</p>
                  <p className="text-xs text-muted-foreground">1.2 MB • Uploaded: 2024-01-14</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SourcesList>
      </div>
    </div>
  );
}
