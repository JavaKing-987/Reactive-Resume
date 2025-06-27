import "@/client/libs/dayjs";

import { i18n } from "@lingui/core";
import { detect, fromStorage, fromUrl } from "@lingui/detect-locale";
import { I18nProvider } from "@lingui/react";
import { languages } from "@reactive-resume/utils";
import { useEffect, useState } from "react";

import { defaultLocale, dynamicActivate } from "../libs/lingui";
import { updateUser } from "../services/user";
import { useAuthStore } from "../stores/auth";

type Props = {
  children: React.ReactNode;
};

export const LocaleProvider = ({ children }: Props) => {
  const userLocale = useAuthStore((state) => state.user?.locale ?? defaultLocale);
  const [currentLocale, setCurrentLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    const detectedLocale =
      detect(fromUrl("locale"), fromStorage("locale"), userLocale, defaultLocale) ?? defaultLocale;

    // Activate the locale only if it's supported
    if (languages.some((lang) => lang.locale === detectedLocale)) {
      void dynamicActivate(detectedLocale);
      setCurrentLocale(detectedLocale);
    } else {
      void dynamicActivate(defaultLocale);
      setCurrentLocale(defaultLocale);
    }
  }, [userLocale]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

// 改进的语言切换函数 - 支持动态切换无需刷新页面
export const changeLanguage = async (locale: string) => {
  try {
    // Update locale in local storage for guest users
    window.localStorage.setItem("locale", locale);

    // Update locale in user profile, if authenticated
    const state = useAuthStore.getState();
    if (state.user) {
      await updateUser({ locale }).catch(() => null);
    }

    // 动态激活新语言 - 避免页面刷新
    await dynamicActivate(locale);

    // 触发 React 重新渲染以更新 UI
    window.dispatchEvent(
      new CustomEvent("locale-changed", {
        detail: { locale },
      }),
    );

    return true;
  } catch (error) {
    console.error("Failed to change language:", error);
    // 如果动态切换失败，则回退到页面刷新
    window.location.reload();
    return false;
  }
};
