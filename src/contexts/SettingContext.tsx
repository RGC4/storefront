"use client";

import { Direction } from "@mui/material/styles";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

// ============================================================
export type SettingsOptions = { direction: Direction };
// ============================================================

// SET "rtl" OR "ltr" HERE
// THEN GOTO BROWSER CONSOLE AND RUN localStorage.clear() TO CLEAR LOCAL STORAGE
const initialSettings: SettingsOptions = { direction: "ltr" };

export const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: (arg: SettingsOptions) => {}
});

export default function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(initialSettings);
  const [mounted, setMounted] = useState(false);

  const updateSettings = (updatedSetting: SettingsOptions) => {
    setSettings(updatedSetting);
    window.localStorage.setItem("settings", JSON.stringify(updatedSetting));
  };

  useEffect(() => {
    const getItem = window.localStorage.getItem("settings");
    if (getItem) {
      setSettings(JSON.parse(getItem));
    }
    setMounted(true);
  }, []);

  // Don't render children until we've read localStorage — prevents the flash
  if (!mounted) return null;

  return <SettingsContext value={{ settings, updateSettings }}>{children}</SettingsContext>;
}
