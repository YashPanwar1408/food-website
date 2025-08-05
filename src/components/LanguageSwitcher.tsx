"use client";
import "../i18n";
import React from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  return (
    <select
      className="px-2 py-1 rounded border bg-white text-black border-border focus:outline-none focus:ring-2 focus:ring-primary hover:ring-2 hover:ring-primary transition dark:bg-white dark:text-black dark:border-[#444857] dark:focus:ring-primary dark:shadow-lg"
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
