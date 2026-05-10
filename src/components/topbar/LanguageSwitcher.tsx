import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("fr") ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-card-hover text-secondary hover:text-primary transition-colors"
      aria-label="Toggle Language"
      title="Toggle Language"
    >
      <Globe size={18} />
      <span className="text-xs font-bold uppercase tracking-wider">
        {i18n.language.startsWith("fr") ? "FR" : "EN"}
      </span>
    </button>
  );
}
