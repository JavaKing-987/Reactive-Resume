export const templatesList = [
  "azurill",
  "bronzor",
  "chikorita",
  "ditto",
  "gengar",
  "glalie",
  "kakuna",
  "leafish",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
] as const;

export type Template = (typeof templatesList)[number];

/**
 * 根据语言过滤模板 - 为中文用户提供更好的体验
 * Filter templates based on language preference - Better experience for Chinese users
 */
export const getFilteredTemplates = (locale?: string): string[] => {
  // 如果没有语言设置，返回所有模板
  if (!locale) {
    return [...templatesList];
  }

  const isChinese = locale.startsWith('zh');
  
  if (isChinese) {
    // 中文用户：优先推荐某些模板，适合中文内容布局
    const chinesePreferred = [
      "chikorita",  // 简洁清晰，适合中文
      "ditto",      // 现代风格
      "leafish",    // 干净布局
      "nosepass",   // 经典样式
      "bronzor",    // 专业风格
      "azurill",    // 创意风格
      "gengar",     // 技术风格
      "glalie",     // 学术风格
      "kakuna",     // 传统布局
      "onyx",       // 商务风格
      "pikachu",    // 活泼风格
      "rhyhorn",    // 稳重风格
    ];
    return chinesePreferred;
  } else {
    // 英文用户：保持原有顺序
    return [...templatesList];
  }
};

/**
 * 获取模板显示名称（支持中文）
 * Get template display name with Chinese support
 */
export const getTemplateDisplayName = (template: string, locale?: string): string => {
  const isChinese = locale?.startsWith('zh');
  
  if (!isChinese) {
    return template.charAt(0).toUpperCase() + template.slice(1);
  }

  // 中文模板名称映射
  const chineseNames: Record<string, string> = {
    "chikorita": "简洁风格",
    "ditto": "现代风格", 
    "leafish": "清新风格",
    "nosepass": "经典风格",
    "bronzor": "专业风格",
    "azurill": "创意风格",
    "gengar": "技术风格",
    "glalie": "学术风格", 
    "kakuna": "传统风格",
    "onyx": "商务风格",
    "pikachu": "活泼风格",
    "rhyhorn": "稳重风格",
  };

  return chineseNames[template] || template;
};
