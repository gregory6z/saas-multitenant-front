import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInvitation } from "@/hooks/use-invitations";

const inviteFormSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "curator", "user"]),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export function InviteMembersCard() {
  const { t } = useTranslation("settings");
  const createInvitation = useCreateInvitation();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  const onSubmit = (values: InviteFormValues) => {
    createInvitation.mutate(values, {
      onSuccess: () => {
        form.reset();
        toast.success(t("members.inviteSuccess"));
      },
      onError: () => {
        toast.error(t("members.inviteError"));
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {t("members.inviteNew")}
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
                      placeholder={t("members.enterEmail")}
                      disabled={createInvitation.isPending}
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
                    disabled={createInvitation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("members.selectRole")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">{t("members.roles.user")}</SelectItem>
                      <SelectItem value="curator">{t("members.roles.curator")}</SelectItem>
                      <SelectItem value="admin">{t("members.roles.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" loading={createInvitation.isPending}>
              <Send className="w-4 h-4" />
              {t("members.sendInvite")}
            </Button>
          </form>
        </Form>
        <p className="text-sm text-muted-foreground">{t("members.invitedMembersWillReceive")}</p>
      </CardContent>
    </Card>
  );
}
