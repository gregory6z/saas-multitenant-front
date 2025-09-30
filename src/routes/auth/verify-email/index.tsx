import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { VerifyEmailForm } from "./-verify-email-form";

const verifyEmailSearch = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/auth/verify-email/")({
  component: VerifyEmailPage,
  validateSearch: verifyEmailSearch,
});

function VerifyEmailPage() {
  return (
    <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="m8 3 4 8 5-5v11H6V9l5 5 4-8Z" />
          </svg>
          MultiSaasWeb
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Verifique seu email e comece a criar chatbots inteligentes em poucos minutos."
            </p>
            <footer className="text-sm opacity-90">Equipe MultiSaasWeb</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <VerifyEmailForm />
        </div>
      </div>
    </div>
  );
}
