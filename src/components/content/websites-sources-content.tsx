import { ChevronDown, ChevronUp, Globe, Info } from "lucide-react";
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

interface WebsitesSourcesContentProps {
  mode: "knowledge-base" | "chatbot";
}

export function WebsitesSourcesContent({}: WebsitesSourcesContentProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("crawl");

  const tabs = [
    { id: "crawl", label: "Crawl links" },
    { id: "sitemap", label: "Sitemap" },
    { id: "individual", label: "Individual link" },
  ];

  const getButtonText = () => {
    switch (activeTab) {
      case "sitemap":
        return "Load sitemap";
      case "individual":
        return "Add link";
      default:
        return "Fetch links";
    }
  };

  const renderTabContent = () => {
    if (activeTab === "individual") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">URL</label>
            <div className="flex gap-2">
              <Select defaultValue="https">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https">https://</SelectItem>
                  <SelectItem value="http">http://</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="www.example.com" className="flex-1" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>{getButtonText()}</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">URL</label>
          <div className="flex gap-2">
            <Select defaultValue="https">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https">https://</SelectItem>
                <SelectItem value="http">http://</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="www.example.com" className="flex-1" />
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Links found during crawling or sitemap retrieval may be updated if new links are
            discovered or some links are invalid.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Include only paths
            </label>
            <Input placeholder="Ex: blog/*, dev/*" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Exclude paths</label>
            <Input placeholder="Ex: blog/*, dev/*" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>{getButtonText()}</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Website</h2>
            <p className="text-muted-foreground">
              Crawl web pages or submit sitemaps to update your AI with the latest content.
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
            Learn more
          </Button>
        </div>

        {/* Add links card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <h3 className="text-lg font-medium">Add links</h3>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {isExpanded && (
                <div className="space-y-4">
                  {/* Tabs */}
                  <div className="flex border-b">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {renderTabContent()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Website sources section */}
        <SourcesList title="Website sources" searchPlaceholder="Search websites...">
          {/* Empty state or website sources list would go here */}
          <div className="mt-8 text-center py-8 text-muted-foreground">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No website sources added yet</p>
          </div>
        </SourcesList>
      </div>
    </div>
  );
}
