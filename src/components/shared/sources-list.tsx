import { Search } from "lucide-react";
import type { ReactNode } from "react";
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

interface SourcesListProps {
  title: string;
  searchPlaceholder?: string;
  children: ReactNode;
  className?: string;
}

export function SourcesList({
  title,
  searchPlaceholder = "Search...",
  children,
  className = "mb-16",
}: SourcesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={searchPlaceholder} className="pl-9 w-64" />
        </div>
      </div>

      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="select-all" />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
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

            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
