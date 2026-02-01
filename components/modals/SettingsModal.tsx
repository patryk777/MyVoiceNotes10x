"use client";

import { X, Settings as SettingsIcon } from "lucide-react";
import { Settings, AppLanguage, TranslationLanguage } from "@/hooks/useSettings";

interface SettingsModalProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
  onClose: () => void;
  t: (key: string) => string;
}

const LANGUAGES: { id: AppLanguage; label: string; flag: string }[] = [
  { id: "pl", label: "Polski", flag: "🇵🇱" },
  { id: "en", label: "English", flag: "🇬🇧" },
];

const TRANSLATION_LANGUAGES: { id: TranslationLanguage; label: string; flag: string }[] = [
  { id: "angielski", label: "English", flag: "🇬🇧" },
  { id: "niemiecki", label: "Deutsch", flag: "🇩🇪" },
  { id: "francuski", label: "Français", flag: "🇫🇷" },
  { id: "hiszpański", label: "Español", flag: "🇪🇸" },
  { id: "polski", label: "Polski", flag: "🇵🇱" },
];

export function SettingsModal({ settings, onUpdate, onClose, t }: SettingsModalProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} ${t("seconds")}`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} ${t("minutes")} ${secs} ${t("seconds")}` : `${mins} ${t("minutes")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-100">{t("settings")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* App Language */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              {t("appLanguageLabel")}
            </label>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onUpdate({ appLanguage: lang.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    settings.appLanguage === lang.id
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Language */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              {t("aiResponseLanguageLabel")}
            </label>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onUpdate({ aiResponseLanguage: lang.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    settings.aiResponseLanguage === lang.id
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Default Translation Language */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              {t("translationLanguageLabel")}
            </label>
            <select
              value={settings.defaultTranslationLanguage}
              onChange={(e) => onUpdate({ defaultTranslationLanguage: e.target.value as TranslationLanguage })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
            >
              {TRANSLATION_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Max Recording Time */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              {t("maxRecordingLabel")}: <span className="text-blue-400">{formatTime(settings.maxRecordingSeconds)}</span>
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={settings.maxRecordingSeconds}
              onChange={(e) => onUpdate({ maxRecordingSeconds: parseInt(e.target.value) })}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>10 {t("seconds")}</span>
              <span>5 {t("minutes")}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-200"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
