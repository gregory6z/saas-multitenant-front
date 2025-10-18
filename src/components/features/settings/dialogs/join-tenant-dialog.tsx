import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { useJoinTenantMutation } from "@/api/queries/tenant";
import { joinTenantRequestSchema } from "@/api/schemas/tenant.schema";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface JoinTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinTenantDialog({ isOpen, onClose }: JoinTenantDialogProps) {
  const { t } = useTranslation("tenants-join");
  const joinTenant = useJoinTenantMutation();

  const formSchema = joinTenantRequestSchema(t);
  type JoinTenantFormData = z.infer<typeof formSchema>;

  const form = useForm<JoinTenantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = async (data: JoinTenantFormData) => {
    try {
      await joinTenant.mutateAsync(data);
      onClose();
      form.reset();
    } catch {
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
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inviteCode")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("inviteCodePlaceholder")}
                      className="uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
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
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={joinTenant.isPending}>
                {joinTenant.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("joining")}
                  </>
                ) : (
                  t("joinButton")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
