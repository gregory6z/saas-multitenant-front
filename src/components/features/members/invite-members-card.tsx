import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInvitation } from "@/hooks/use-invitations";

export function InviteMembersCard() {
  const { t } = useTranslation("settings-members");

  // ✅ Usa hook existente de convites
  const inviteMutation = useCreateInvitation();

  const inviteFormSchema = z.object({
    email: z.email(t("errors.inviteInvalidEmail")),
    role: z.enum(["admin", "curator", "user"]),
  });

  type InviteFormValues = z.infer<typeof inviteFormSchema>;

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  const onSubmit = (values: InviteFormValues) => {
    inviteMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {t("actions.invite")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={t("modals.invite.emailPlaceholder")}
                      disabled={inviteMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={inviteMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("modals.invite.rolePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">{t("roles.user")}</SelectItem>
                      <SelectItem value="curator">{t("roles.curator")}</SelectItem>
                      <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" loading={inviteMutation.isPending}>
              <Send className="w-4 h-4" />
              {t("modals.invite.sendButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
