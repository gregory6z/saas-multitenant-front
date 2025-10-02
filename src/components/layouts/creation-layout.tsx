import { SourcesSidebar } from "@/components/chatbot/sources-sidebar";
import { FilesContent } from "@/components/knowledge/sources/files-content";
import { IndexContent } from "@/components/knowledge/sources/index-content";
import { KnowledgeContent } from "@/components/knowledge/sources/knowledge-content";
import { TextContent } from "@/components/knowledge/sources/text-content";
import { WebsitesContent } from "@/components/knowledge/sources/websites-content";

interface CreationLayoutProps {
  mode: "knowledge-base" | "chatbot";
  type: "index" | "files" | "text" | "websites" | "knowledge";
}

export function CreationLayout({ mode, type }: CreationLayoutProps) {
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
