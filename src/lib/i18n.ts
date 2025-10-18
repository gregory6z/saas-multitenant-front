import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Translations - organized by namespace
import enAuth from "@/locales/en/auth.json";
import enCommon from "@/locales/en/common.json";
import enDashboard from "@/locales/en/dashboard.json";
import enSettingsGeneral from "@/locales/en/features/settings/general.json";
import enSettingsMembers from "@/locales/en/features/settings/members.json";
import enTenantsCreate from "@/locales/en/features/tenants/create.json";
import enTenantsJoin from "@/locales/en/features/tenants/join.json";
import esAuth from "@/locales/es/auth.json";
import esSettingsGeneral from "@/locales/es/features/settings/general.json";
import esSettingsMembers from "@/locales/es/features/settings/members.json";
import esTenantsCreate from "@/locales/es/features/tenants/create.json";
import esTenantsJoin from "@/locales/es/features/tenants/join.json";
import frAuth from "@/locales/fr/auth.json";
import frCommon from "@/locales/fr/common.json";
import frDashboard from "@/locales/fr/dashboard.json";
import frSettingsGeneral from "@/locales/fr/features/settings/general.json";
import frSettingsMembers from "@/locales/fr/features/settings/members.json";
import frTenantsCreate from "@/locales/fr/features/tenants/create.json";
import frTenantsJoin from "@/locales/fr/features/tenants/join.json";
import ptAuth from "@/locales/pt/auth.json";
import ptCommon from "@/locales/pt/common.json";
import ptDashboard from "@/locales/pt/dashboard.json";
// Features - Settings/Members
import ptSettingsGeneral from "@/locales/pt/features/settings/general.json";
import ptSettingsMembers from "@/locales/pt/features/settings/members.json";
import ptSettings from "@/locales/pt/settings.json";
// Features - Tenants
import ptTenantsCreate from "@/locales/pt/features/tenants/create.json";
import ptTenantsJoin from "@/locales/pt/features/tenants/join.json";

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    dashboard: enDashboard,
    settings: ptSettings, // Fallback to Portuguese for now
    "settings-general": enSettingsGeneral,
    "settings-members": enSettingsMembers,
    "tenants-create": enTenantsCreate,
    "tenants-join": enTenantsJoin,
  },
  es: {
    auth: esAuth,
    common: enCommon, // Fallback to English for now
    dashboard: enDashboard, // Fallback to English for now
    settings: ptSettings, // Fallback to Portuguese for now
    "settings-general": esSettingsGeneral,
    "settings-members": esSettingsMembers,
    "tenants-create": esTenantsCreate,
    "tenants-join": esTenantsJoin,
  },
  fr: {
    auth: frAuth,
    common: frCommon,
    dashboard: frDashboard,
    settings: ptSettings, // Fallback to Portuguese for now
    "settings-general": frSettingsGeneral,
    "settings-members": frSettingsMembers,
    "tenants-create": frTenantsCreate,
    "tenants-join": frTenantsJoin,
  },
  pt: {
    auth: ptAuth,
    common: ptCommon,
    dashboard: ptDashboard,
    settings: ptSettings,
    "settings-general": ptSettingsGeneral,
    "settings-members": ptSettingsMembers,
    "tenants-create": ptTenantsCreate,
    "tenants-join": ptTenantsJoin,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // Force Portuguese for testing
    fallbackLng: "en", // English as fallback language
    detection: {
      // Configure language detection
      order: ["navigator", "localStorage"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
      convertDetectedLanguage: (lng: string) => {
        // Extract only the language part (before the dash)
        const languageCode = lng.split("-")[0];
        return languageCode;
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: [
      "auth",
      "common",
      "dashboard",
      "settings",
      "settings-general",
      "settings-members",
      "tenants-create",
      "tenants-join",
    ],
    defaultNS: "auth",
    supportedLngs: ["en", "es", "fr", "pt"], // Languages supported by the app
    cleanCode: true,
    load: "languageOnly", // Load only language code (fr, en) not region (fr-FR, en-US)
  });

export default i18n;
