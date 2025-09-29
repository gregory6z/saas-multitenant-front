import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroDescription?: string;
}

export function AuthLayout({ children, heroTitle, heroDescription }: AuthLayoutProps) {
  const { t } = useTranslation("auth");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Modern geometric elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full translate-y-36 -translate-x-36"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-300/30 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-indigo-300/40 rounded-full"></div>

        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <a href="/" className="flex items-center gap-3 font-semibold text-xl">
            <Bot className="size-8 text-primary" />
            <span className="text-primary font-bold">RagBoost</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center relative z-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="text-center text-white p-8 max-w-md">
          <Bot className="size-20 mx-auto mb-6 opacity-20" />
          <h2 className="text-3xl font-bold mb-4">{heroTitle || t("login.heroTitle")}</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            {heroDescription || t("login.heroDescription")}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-blue-200 text-sm">{t("login.stats.activeBots")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-blue-200 text-sm">{t("login.stats.integrations")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-blue-200 text-sm">{t("login.stats.uptime")}</div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
