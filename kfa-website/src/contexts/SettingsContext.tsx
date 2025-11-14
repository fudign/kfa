import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseSettingsAPI } from '@/lib/supabase-settings';

interface SettingsContextType {
  settings: Record<string, string>;
  loading: boolean;
  getSetting: (key: string, defaultValue?: string) => string;
  getSettingBool: (key: string, defaultValue?: boolean) => boolean;
  getSettingNumber: (key: string, defaultValue?: number) => number;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const allSettings = await supabaseSettingsAPI.getAll();
      const flatSettings: Record<string, string> = {};

      // Flatten all categories into single object
      Object.values(allSettings).flat().forEach(setting => {
        flatSettings[setting.key] = setting.value ?? '';
      });

      setSettings(flatSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings[key] || defaultValue;
  };

  const getSettingBool = (key: string, defaultValue: boolean = false): boolean => {
    const value = settings[key];
    if (value === undefined || value === null) return defaultValue;
    return value === 'true' || value === '1' || value === 'yes';
  };

  const getSettingNumber = (key: string, defaultValue: number = 0): number => {
    const value = settings[key];
    if (value === undefined || value === null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        getSetting,
        getSettingBool,
        getSettingNumber,
        refreshSettings: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
