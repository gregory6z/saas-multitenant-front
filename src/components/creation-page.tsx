import { FilesContent } from "@/components/content/files-content";
import { IndexContent } from "@/components/content/index-content";
import { KnowledgeContent } from "@/components/content/knowledge-content";
import { TextContent } from "@/components/content/text-content";
import { WebsitesContent } from "@/components/content/websites-content";
import { SourcesSidebar } from "@/components/sources-sidebar";

interface CreationPageProps {
  mode: "knowledge-base" | "chatbot";
  type: "index" | "files" | "text" | "websites" | "knowledge";
}

export function CreationPage({ mode, type }: CreationPageProps) {
  const renderContent = () => {
    switch (type) {
      case "index":
        return <IndexContent mode={mode} />;
      case "files":
        return <FilesContent mode={mode} />;
      case "text":
        return <TextContent mode={mode} />;
      case "websites":
        return <WebsitesContent mode={mode} />;
      case "knowledge":
        return <KnowledgeContent mode={mode} />;
      default:
        return <IndexContent mode={mode} />;
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 mr-80">{renderContent()}</div>
      <SourcesSidebar mode={mode} />
    </div>
  );
}
