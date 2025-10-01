import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useTenants } from "@/hooks/use-tenants";

// Form schema for joining tenant
const joinTenantFormSchema = z.object({
  inviteCode: z
    .string()
    .min(1, "Código de convite é obrigatório")
    .regex(/^[A-Z0-9]{6,12}$/, "Código deve conter apenas letras maiúsculas e números"),
});

type JoinTenantFormData = z.infer<typeof joinTenantFormSchema>;

interface JoinTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinTenantModal({ isOpen, onClose }: JoinTenantModalProps) {
  const { joinTenant } = useTenants();

  const form = useForm<JoinTenantFormData>({
    resolver: zodResolver(joinTenantFormSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = async (data: JoinTenantFormData) => {
    try {
      await joinTenant.mutateAsync(data);
      onClose();
      form.reset();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    joinTenant.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Juntar-se a uma organização
          </DialogTitle>
          <DialogDescription>
            Digite o código de convite para juntar-se a uma organização existente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de convite</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC123XYZ"
                      className="uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    O código de convite foi fornecido pelo administrador da organização.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {joinTenant.isError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {joinTenant.error instanceof Error
                  ? joinTenant.error.message
                  : "Erro ao juntar-se à organização. Verifique o código e tente novamente."}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={joinTenant.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={joinTenant.isPending}
              >
                {joinTenant.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Juntando...
                  </>
                ) : (
                  "Juntar-se"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}