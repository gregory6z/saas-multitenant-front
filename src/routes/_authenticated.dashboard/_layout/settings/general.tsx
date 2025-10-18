import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Check, Info, Trash2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUpdateTenantMutation } from "@/api/queries/tenant";
import { type UpdateTenantRequest, UpdateTenantRequestSchema } from "@/api/schemas/tenant.schema";
import { DeleteTenantDialog } from "@/components/features/settings/general/dialogs/delete-tenant-dialog";
import { TransferOwnershipCard } from "@/components/features/settings/members/transfer-ownership-card";
import { TransferOwnershipDialog } from "@/components/features/settings/general/dialogs/transfer-ownership-dialog";
import { GeneralPageSkeleton } from "@/components/skeletons/general-page-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCurrentTenant } from "@/hooks/use-current-tenant";
import { useCurrentUserRole, useTeamMembers } from "@/hooks/use-team-members";
import { getDisplayDomain } from "@/lib/env";

type UpdateTenantFormData = UpdateTenantRequest;

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/general")({
  component: GeneralPage,
});

function GeneralPage() {
  const { t } = useTranslation("settings-general");
  const { currentTenant, isLoading: tenantLoading } = useCurrentTenant();

  // ✅ Usa hooks da API diretamente
  const updateTenant = useUpdateTenantMutation();

  const { data: members } = useTeamMembers();
  const { role: currentUserRole } = useCurrentUserRole();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [transferTarget, setTransferTarget] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const form = useForm<UpdateTenantFormData>({
    resolver: zodResolver(UpdateTenantRequestSchema),
    defaultValues: {
      name: "",
      subdomain: "",
    },
  });

  // Update form when tenant data loads
  React.useEffect(() => {
    if (currentTenant) {
      form.reset({
        name: currentTenant.name,
        subdomain: currentTenant.subdomain,
      });
    }
  }, [currentTenant, form.reset]);

  // Check if form has changes - optimized to watch only specific fields
  const watchedFields = form.watch(["name", "subdomain"]);
  const hasChanges = React.useMemo(() => {
    if (!currentTenant) return false;

    return watchedFields[0] !== currentTenant.name || watchedFields[1] !== currentTenant.subdomain;
  }, [watchedFields, currentTenant]);

  // Calculate eligible members for ownership transfer
  const eligibleMembers = React.useMemo(() => {
    if (!members || !currentTenant) return [];
    return members.filter((member) => member.id !== currentTenant.ownerId);
  }, [members, currentTenant]);

  /**
   * Handles form submission for tenant update
   */
  const onSubmit = React.useCallback(
    (data: UpdateTenantFormData) => {
      updateTenant.mutate(data);
    },
    [updateTenant]
  );

  /**
   * Handles subdomain input transformation in real-time
   * Applies sanitization rules: lowercase, alphanumeric + hyphens only,
   * converts spaces to hyphens, removes duplicate hyphens and edge hyphens
   */
  const handleSubdomainChange = React.useCallback(
    (value: string) => {
      const transformed = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      form.setValue("subdomain", transformed);
    },
    [form.setValue]
  );

  /**
   * Handles ownership transfer target selection
   */
  const handleTransferOwnership = React.useCallback((newOwnerId: string, newOwnerName: string) => {
    setTransferTarget({ id: newOwnerId, name: newOwnerName });
  }, []);

  /**
   * Handles transfer modal close
   */
  const handleCloseTransferModal = React.useCallback((open: boolean) => {
    if (!open) {
      setTransferTarget(null);
    }
  }, []);

  if (tenantLoading || !currentTenant) {
    return <GeneralPageSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 px-4 md:px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      </div>

      {/* Workspace Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {t("organizationDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("organizationName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("organizationNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subdomain")}</FormLabel>
                    <FormControl>
                      <div className="flex items-stretch">
                        <Input
                          placeholder={t("subdomainPlaceholder")}
                          {...field}
                          onChange={(e) => handleSubdomainChange(e.target.value)}
                          className="rounded-r-none"
                        />
                        <div className="bg-muted text-muted-foreground px-3 py-2 border border-l-0 rounded-r-md text-sm flex items-center min-w-fit">
                          .{getDisplayDomain()}
                        </div>
                      </div>
                    </FormControl>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span>{t("subdomainWarning")}</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={!hasChanges} loading={updateTenant.isPending}>
                  <Check className="w-4 h-4" />
                  {t("saveChanges")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <div className="space-y-6">
        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="px-6 text-red-600 text-sm font-medium">{t("dangerZone")}</span>
          <Separator className="flex-1" />
        </div>

        {/* Transfer Ownership - Only visible for owners with eligible members */}
        {currentUserRole === "owner" && eligibleMembers.length > 0 && (
          <TransferOwnershipCard
            members={members || []}
            currentUserId={currentTenant?.ownerId || ""}
            onTransfer={handleTransferOwnership}
          />
        )}

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Trash2 className="w-5 h-5" />
              {t("deleteOrganization")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("deleteWarning1")}</p>
              <p>{t("deleteWarning2")}</p>
            </div>

            <div className="flex justify-end">
              <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 className="w-4 h-4" />
                {t("deleteOrganization")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Tenant Dialog */}
      {currentTenant && (
        <DeleteTenantDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          tenantName={currentTenant.name}
        />
      )}

      {/* Transfer Ownership Dialog */}
      {transferTarget && (
        <TransferOwnershipDialog
          open={!!transferTarget}
          onOpenChange={handleCloseTransferModal}
          newOwnerId={transferTarget.id}
          newOwnerName={transferTarget.name}
        />
      )}
    </div>
  );
}
