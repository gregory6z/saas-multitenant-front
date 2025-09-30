import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useCreateTenant } from "@/hooks/use-tenants";

// Form schema based on API requirements
const createTenantFormSchema = z.object({
  name: z.string().min(1, "Nome da organização é obrigatório"),
  subdomain: z
    .string()
    .min(3, "Subdomínio deve ter pelo menos 3 caracteres")
    .max(63, "Subdomínio deve ter no máximo 63 caracteres")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Subdomínio deve conter apenas letras minúsculas, números e hífens"
    )
    .refine(
      (value) => !value.startsWith("-") && !value.endsWith("-"),
      "Subdomínio não pode começar ou terminar com hífen"
    ),
});

type CreateTenantFormData = z.infer<typeof createTenantFormSchema>;

export function CreateTenantForm() {
  const createTenant = useCreateTenant();

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantFormSchema),
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

    // Auto-generate subdomain from name
    const subdomain = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    if (subdomain && !form.getValues("subdomain")) {
      form.setValue("subdomain", subdomain);
    }
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
              <FormLabel>Nome da Organização</FormLabel>
              <FormControl>
                <Input
                  placeholder="Minha Empresa"
                  {...field}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                O nome da sua organização como aparecerá na plataforma
              </FormDescription>
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
              <FormLabel>Subdomínio</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input placeholder="minha-empresa" {...field} className="rounded-r-none" />
                  <div className="bg-muted text-muted-foreground px-3 py-2 border border-l-0 rounded-r-md text-sm">
                    .multisaas.app
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Seu subdomínio único. Apenas letras minúsculas, números e hífens
              </FormDescription>
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
              Criando organização...
            </>
          ) : (
            "Criar Organização"
          )}
        </Button>
      </form>
    </Form>
  );
}
