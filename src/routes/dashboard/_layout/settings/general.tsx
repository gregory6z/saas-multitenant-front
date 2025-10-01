import { createFileRoute } from "@tanstack/react-router";
import { Info, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCurrentTenant } from "@/hooks/use-current-tenant";
import { useTenants, type UpdateTenantRequest, UpdateTenantRequestSchema } from "@/hooks/use-tenants";

type UpdateTenantFormData = UpdateTenantRequest;

export const Route = createFileRoute("/dashboard/_layout/settings/general")({
  component: GeneralPage,
});

function GeneralPage() {
  const { t } = useTranslation("common");
  const { currentTenant, isLoading: tenantLoading } = useCurrentTenant();
  const { updateTenant } = useTenants();

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
      formValues.name !== currentTenant.name ||
      formValues.subdomain !== currentTenant.subdomain
    );
  }, [formValues, currentTenant]);

  const onSubmit = (data: UpdateTenantFormData) => {
    if (currentTenant?.id) {
      updateTenant.mutate({ id: currentTenant.id, data });
    }
  };

  if (tenantLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.general")}</h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.general")}</h1>
        </div>

        <div className="flex items-center justify-center py-12">
          <p className="text-red-600">Erro: Organização não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8">
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
                          className="rounded-r-none"
                        />
                        <div className="bg-muted text-muted-foreground px-3 py-2 border border-l-0 rounded-r-md text-sm flex items-center min-w-fit">
                          .multisaas.app
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
                  Erro ao atualizar organização: {(updateTenant.error as Error)?.message || "Erro desconhecido"}
                </div>
              )}

              {/* Success Message */}
              {updateTenant.isSuccess && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                  Organização atualizada com sucesso!
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!hasChanges || updateTenant.isPending}
                >
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
          <span className="px-6 text-red-600 text-sm font-medium">
            Zona de Perigo
          </span>
          <Separator className="flex-1" />
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Excluir Organização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Esta ação não pode ser desfeita. Todos os dados da organização serão permanentemente excluídos.</p>
              <p>Todos os chatbots, configurações e dados de usuários serão perdidos.</p>
            </div>

            <div className="flex justify-end">
              <Button 
                variant="destructive"
                onClick={() => {
                  // TODO: Implement delete tenant functionality
                  alert("Funcionalidade de exclusão será implementada");
                }}
              >
                Excluir Organização
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
