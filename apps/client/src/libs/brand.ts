import { i18n } from "@lingui/core";

/**
 * 根据当前语言设置返回相应的品牌名称
 * Returns the appropriate brand name based on current language setting
 */
export function getBrandName(): string {
  const locale = i18n.locale || "zh-CN";
  // eslint-disable-next-line lingui/no-unlocalized-strings
  return locale.startsWith("zh") ? "王者简历" : "King Resume";
}
