import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/_layout/settings/general")({
  component: GeneralPage,
});

function GeneralPage() {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.general")}</h1>
      </div>

      {/* Workspace Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.general.workspaceDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">{t("settings.general.workspaceName")}</Label>
            <Input id="workspace-name" defaultValue="gregoryTest" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-url">{t("settings.general.workspaceUrl")}</Label>
            <Input id="workspace-url" defaultValue="kmmlkm" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>{t("settings.general.urlWarning")}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>{t("settings.general.save")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <div className="space-y-6">
        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="px-6 text-red-600 text-sm font-medium">
            {t("settings.general.dangerZone")}
          </span>
          <Separator className="flex-1" />
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">{t("settings.general.deleteWorkspace")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("settings.general.deleteWarning1")}</p>
              <p>{t("settings.general.deleteWarning2")}</p>
            </div>

            <div className="flex justify-end">
              <Button variant="destructive">{t("settings.general.delete")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
