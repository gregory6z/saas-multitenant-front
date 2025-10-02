import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Info, Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DeleteTenantModal } from "@/components/modals/delete-tenant-modal";
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
import {
  type UpdateTenantRequest,
  UpdateTenantRequestSchema,
  useTenants,
} from "@/hooks/use-tenants";
import { getDisplayDomain } from "@/lib/env";

type UpdateTenantFormData = UpdateTenantRequest;

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/general")({
  component: GeneralPage,
});

function GeneralPage() {
  const { t } = useTranslation("common");
  const { currentTenant, isLoading: tenantLoading } = useCurrentTenant();
  const { updateTenant, deleteTenant } = useTenants();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

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
  }, [currentTenant, form]);

  // Check if form has changes
  const formValues = form.watch();
  const hasChanges = React.useMemo(() => {
    if (!currentTenant) return false;

    return (
      formValues.name !== currentTenant.name || formValues.subdomain !== currentTenant.subdomain
    );
  }, [formValues, currentTenant]);

  const onSubmit = (data: UpdateTenantFormData) => {
    if (currentTenant?.id) {
      updateTenant.mutate({ id: currentTenant.id, data });
    }
  };

  // Handle subdomain change with real-time transformation
  const handleSubdomainChange = (value: string) => {
    // Apply same transformation as Zod schema for real-time preview
    const transformed = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("subdomain", transformed);
  };

  const handleDeleteTenant = () => {
    deleteTenant.mutate(undefined, {
      onSuccess: () => {
        toast.success("Organização excluída com sucesso");
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao excluir organização");
      },
    });
  };

  if (tenantLoading || !currentTenant) {
    return <GeneralPageSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 px-4 md:px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.general")}</h1>
      </div>

      {/* Workspace Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Organização</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Organização</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sua organização" {...field} />
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
                    <FormLabel>Subdomínio</FormLabel>
                    <FormControl>
                      <div className="flex items-stretch">
                        <Input
                          placeholder="minha-empresa"
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
                      <span>Mudanças no subdomínio podem afetar o acesso à organização</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {updateTenant.isError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  Erro ao atualizar organização:{" "}
                  {(updateTenant.error as Error)?.message || "Erro desconhecido"}
                </div>
              )}

              {/* Success Message */}
              {updateTenant.isSuccess && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                  Organização atualizada com sucesso!
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={!hasChanges || updateTenant.isPending}>
                  {updateTenant.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
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
          <span className="px-6 text-red-600 text-sm font-medium">Zona de Perigo</span>
          <Separator className="flex-1" />
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Excluir Organização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Esta ação não pode ser desfeita. Todos os dados da organização serão permanentemente
                excluídos.
              </p>
              <p>Todos os chatbots, configurações e dados de usuários serão perdidos.</p>
            </div>

            <div className="flex justify-end">
              <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                Excluir Organização
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Tenant Modal */}
      {currentTenant && (
        <DeleteTenantModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          tenantName={currentTenant.name}
          onConfirm={handleDeleteTenant}
          isDeleting={deleteTenant.isPending}
        />
      )}
    </div>
  );
}
