import { useTranslation } from "react-i18next";

import { useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface TranslatedFormMessageProps extends React.ComponentProps<"p"> {
  namespace?: string;
}

export function TranslatedFormMessage({
  className,
  namespace = "auth",
  ...props
}: TranslatedFormMessageProps) {
  const { t } = useTranslation(namespace);
  const { error, formMessageId } = useFormField();

  if (!error) {
    return null;
  }

  const message = error.message;
  const translatedMessage = message?.startsWith("validation.") ? t(message) : message;

  return (
    <p id={formMessageId} className={cn("text-destructive text-sm", className)} {...props}>
      {translatedMessage}
    </p>
  );
}
