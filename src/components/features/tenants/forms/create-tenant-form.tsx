import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { useCreateTenantMutation } from "@/api/queries/tenant";
import { createTenantRequestSchema } from "@/api/schemas/tenant.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getDisplayDomain } from "@/lib/env";

export function CreateTenantForm() {
  const { t } = useTranslation("tenants-create");
  const createTenant = useCreateTenantMutation();
  const [subdomainManuallyEdited, setSubdomainManuallyEdited] = useState(false);

  const formSchema = createTenantRequestSchema(t);
  type CreateTenantFormData = z.infer<typeof formSchema>;

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subdomain: "",
    },
  });

  const onSubmit = (data: CreateTenantFormData) => {
    const payload = {
      name: data.name,
      subdomain: data.subdomain,
    };

    createTenant.mutate(payload);
  };

  // Auto-generate subdomain from name
  const handleNameChange = (value: string) => {
    form.setValue("name", value);

    // Only auto-populate if user hasn't manually edited the subdomain
    if (!subdomainManuallyEdited) {
      // Apply same transformation as Zod schema for real-time preview
      const transformed = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      form.setValue("subdomain", transformed);
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
    setSubdomainManuallyEdited(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("organizationName")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("organizationNamePlaceholder")}
                  {...field}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subdomain */}
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
              <FormDescription>{t("subdomainHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {createTenant.isError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {createTenant.error instanceof Error
              ? createTenant.error.message
              : "Erro ao criar organização. Tente novamente."}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={createTenant.isPending}>
          {createTenant.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("creating")}
            </>
          ) : (
            t("createButton")
          )}
        </Button>
      </form>
    </Form>
  );
}
