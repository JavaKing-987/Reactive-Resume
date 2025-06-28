import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import type { ResumeData } from "@reactive-resume/schema";
import {
  AspectRatio,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reactive-resume/ui";
import { cn, getFilteredTemplates, getTemplateDisplayName } from "@reactive-resume/utils";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useResumeStore } from "@/client/stores/resume";

import { SectionIcon } from "../shared/section-icon";

// 可用的语言选项
const LANGUAGE_OPTIONS = [
  { value: "all", label: "All Languages", labelZh: "所有语言" },
  { value: "en", label: "English", labelZh: "英语" },
  { value: "zh", label: "Chinese", labelZh: "中文" },
];

// 获取语言标签的函数
const getLanguageLabel = (option: typeof LANGUAGE_OPTIONS[0], locale: string) => {
  return locale?.startsWith("zh") ? option.labelZh : option.label;
};

// 智能合并函数 - 支持覆盖模式
const smartMerge = (currentData: ResumeData, templateData: ResumeData, replaceContent = false): ResumeData => {
  const mergeObject = (current: any, template: any): any => {
    if (!template || typeof template !== "object") return current;
    if (!current || typeof current !== "object") return template;

    const result = { ...current };

    for (const key in template) {
      if (template[key] === null || template[key] === undefined) continue;

      // 如果开启替换内容模式，优先使用模板值
      if (replaceContent) {
        // 保留一些重要的元数据，不要覆盖
        if (key === "template" || key === "createdAt" || key === "updatedAt") {
          continue;
        }
        result[key] = template[key];
      }
      // 智能填充模式：只填充空字段
      else if (current[key] === null || current[key] === undefined || current[key] === "") {
        result[key] = template[key];
      }
      // 如果是数组且当前数组为空，使用模板数组
      else if (
        Array.isArray(current[key]) &&
        current[key].length === 0 &&
        Array.isArray(template[key])
      ) {
        result[key] = template[key];
      }
      // 如果是对象，递归合并
      else if (
        typeof current[key] === "object" &&
        typeof template[key] === "object" &&
        !Array.isArray(current[key])
      ) {
        result[key] = mergeObject(current[key], template[key]);
      }
    }

    return result;
  };

  return mergeObject(currentData, templateData);
};

// 加载模板数据
const loadTemplateData = async (
  templateName: string,
  locale: string,
): Promise<ResumeData | null> => {
  try {
    // 根据明确的语言选择确定模板文件
    const templateFile = locale === "zh" ? `${templateName}-zh.json` : `${templateName}.json`;

    console.log(`🔍 正在加载模板: ${templateName}, 语言: ${locale}, 文件: ${templateFile}`);

    let response = await fetch(`/templates/json/${templateFile}`);

    // 如果指定语言模板不存在，回退到英文模板
    if (!response.ok && locale === "zh") {
      console.log(`⚠️ 中文模板 ${templateFile} 加载失败, 回退到英文模板`);
      response = await fetch(`/templates/json/${templateName}.json`);
    }

    if (response.ok) {
      const data = (await response.json()) as ResumeData;
      console.log(`✅ 成功加载模板数据:`, data);
      return data;
    } else {
      console.error(`❌ 模板加载失败: ${templateFile}, 状态: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ 模板加载错误:`, error);
    return null;
  }
};

// 应用模板数据的函数
const applyTemplateData = (
  setValue: (path: string, value: unknown) => void,
  currentData: ResumeData,
  templateData: ResumeData,
  replaceContent = false,
) => {
  const mergedData = smartMerge(currentData, templateData, replaceContent);

  // 分别设置各个部分
  if (mergedData.basics) {
    setValue("basics", mergedData.basics);
  }

  if (mergedData.sections) {
    setValue("sections", mergedData.sections);
  }

  // 只更新 metadata 中的某些字段，保留当前的模板设置
  if (mergedData.metadata) {
    if (mergedData.metadata.page) {
      setValue("metadata.page", mergedData.metadata.page);
    }
    if (mergedData.metadata.theme) {
      setValue("metadata.theme", mergedData.metadata.theme);
    }
    if (mergedData.metadata.layout) {
      setValue("metadata.layout", mergedData.metadata.layout);
    }
    if (mergedData.metadata.typography) {
      setValue("metadata.typography", mergedData.metadata.typography);
    }
  }

  console.log(`✅ 模板数据应用完成，替换模式: ${replaceContent}`);
};

export const TemplateSection = () => {
  const { i18n } = useLingui();
  const setValue = useResumeStore((state) => state.setValue);
  const currentTemplate = useResumeStore((state) => state.resume.data.metadata.template);
  const currentData = useResumeStore((state) => state.resume.data);

  // 状态管理 - 默认选择中文模板
  const [selectedLanguage, setSelectedLanguage] = useState<string>("zh");

  // 根据选择的语言过滤模板
  const filteredTemplates = useMemo(() => {
    const allTemplates = getFilteredTemplates(i18n.locale);
    return allTemplates; // 显示所有模板，但根据语言选择加载不同内容
  }, [i18n.locale]);

  // 直接应用模板的核心逻辑 - 移除确认对话框
  const handleTemplateSelect = async (template: string) => {
    try {
      console.log(
        `🎯 开始处理模板选择: ${template}, 当前语言: ${i18n.locale}, 选择语言: ${selectedLanguage}`,
      );

      // 首先更新模板样式
      setValue("metadata.template", template);
      console.log(`📋 已更新模板设置为: ${template}`);

      // 决定使用哪种语言的模板数据 - 强制使用选择的语言
      let targetLocale = selectedLanguage;
      
      // 如果用户选择了"all"，优先使用中文
      if (selectedLanguage === "all") {
        targetLocale = "zh";
      }

      console.log(`🌐 目标语言: ${targetLocale}`);

      // 加载模板数据并应用 - 使用强制替换模式确保中文内容被应用
      const templateData = await loadTemplateData(template, targetLocale);
      if (templateData) {
        console.log(`🔄 开始应用模板数据，强制替换模式...`);
        // 强制替换内容以确保中文模板内容被正确应用
        applyTemplateData(setValue, currentData, templateData, true);
        console.log(`🎉 模板 ${template} 应用完成！`);
      } else {
        console.warn(`⚠️ 无法加载模板数据: ${template}`);
      }
    } catch (error) {
      console.error(`❌ 模板应用失败:`, error);
    }
  };

  return (
    <section id="template" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SectionIcon id="template" size={18} name={i18n.locale?.startsWith("zh") ? "模板" : t`Template`} />
          <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">
            {i18n.locale?.startsWith("zh") ? "模板" : t`Template`}
          </h2>
        </div>
      </header>

      {/* 语言过滤器 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {i18n.locale?.startsWith("zh") ? "模板语言" : t`Template Language`}
        </label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder={i18n.locale?.startsWith("zh") ? "选择语言..." : t`Select language...`} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {getLanguageLabel(option, i18n.locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 模板说明 */}
      <div className="bg-muted/50 rounded-lg border border-border p-3">
        <p className="text-muted-foreground text-sm">
          {selectedLanguage === "zh" && (
            <>
              {i18n.locale?.startsWith("zh") 
                ? "点击任意模板直接应用中文内容和样式。"
                : "Click any template to directly apply Chinese content and styling."
              }
            </>
          )}
          {selectedLanguage === "en" && (
            <>
              {i18n.locale?.startsWith("zh")
                ? "点击任意模板直接应用英文内容和样式。"
                : "Click any template to directly apply English content and styling."
              }
            </>
          )}
          {selectedLanguage === "all" && (
            <>
              {i18n.locale?.startsWith("zh")
                ? "点击任意模板直接应用内容和样式。默认使用中文内容。"
                : "Click any template to directly apply content and styling. Chinese content will be used by default."
              }
            </>
          )}
        </p>
      </div>

      <main className="grid grid-cols-2 gap-8 @lg/right:grid-cols-3 @2xl/right:grid-cols-4">
        {filteredTemplates.map((template, index) => {
          const displayName = getTemplateDisplayName(template, i18n.locale);
          
          // 决定使用哪个预览图片
          const getPreviewImage = () => {
            if (selectedLanguage === "zh") {
              // 尝试使用中文预览图，如果不存在则回退到英文
              return `/templates/jpg/${template}-zh.jpg`;
            }
            return `/templates/jpg/${template}.jpg`;
          };

          return (
            <AspectRatio key={template} ratio={1 / 1.4142}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: index * 0.1 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                className={cn(
                  "relative cursor-pointer rounded-sm ring-primary transition-all hover:shadow-lg hover:ring-2",
                  currentTemplate === template && "shadow-lg ring-2",
                )}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={getPreviewImage()}
                  alt={template}
                  className="size-full rounded-sm object-cover"
                  onError={(e) => {
                    // 如果中文预览图加载失败，回退到英文预览图
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('-zh.jpg')) {
                      target.src = `/templates/jpg/${template}.jpg`;
                    }
                  }}
                />

                {/* 语言标识 */}
                <div className="absolute right-2 top-2">
                  {selectedLanguage === "zh" && (
                    <Badge variant="secondary" className="text-xs">
                      {i18n.locale?.startsWith("zh") ? "中文" : "ZH"}
                    </Badge>
                  )}
                  {selectedLanguage === "en" && (
                    <Badge variant="secondary" className="text-xs">
                      {i18n.locale?.startsWith("zh") ? "英文" : "EN"}
                    </Badge>
                  )}
                </div>

                {/* 当前选中标识 */}
                {currentTemplate === template && (
                  <div className="absolute left-2 top-2">
                    <Badge variant="primary" className="text-xs">
                      ✓ {i18n.locale?.startsWith("zh") ? "当前" : t`Active`}
                    </Badge>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-background/80">
                  <p className="absolute inset-x-0 bottom-2 px-2 text-center text-sm font-bold text-primary">
                    {displayName}
                  </p>
                </div>
              </motion.div>
            </AspectRatio>
          );
        })}
      </main>
    </section>
  );
};
