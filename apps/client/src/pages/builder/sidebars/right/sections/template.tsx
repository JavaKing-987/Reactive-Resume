import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import type { ResumeData } from "@reactive-resume/schema";
import {
  AspectRatio,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
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

  // 状态管理
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string>("");
  const [replaceContent, setReplaceContent] = useState(false);

  // 根据选择的语言过滤模板
  const filteredTemplates = useMemo(() => {
    const allTemplates = getFilteredTemplates(i18n.locale);

    if (selectedLanguage === "all") {
      return allTemplates;
    } else if (selectedLanguage === "zh") {
      return allTemplates; // 显示所有模板，用户选择中文时会加载中文内容
    } else {
      return allTemplates; // 显示所有模板，用户选择英文时会加载英文内容
    }
  }, [i18n.locale, selectedLanguage]);

  // 检查是否有现有内容
  const hasExistingContent = useMemo(() => {
    return (
      (currentData.basics?.name && currentData.basics.name.trim() !== "") ||
      (currentData.sections?.experience?.items && currentData.sections.experience.items.length > 0) ||
      (currentData.sections?.education?.items && currentData.sections.education.items.length > 0)
    );
  }, [currentData]);

  // 处理模板选择
  const handleTemplateSelect = async (template: string) => {
    try {
      // 如果有现有内容，显示确认对话框
      if (hasExistingContent) {
        setPendingTemplate(template);
        setShowConfirmDialog(true);
        return;
      }

      // 没有现有内容，直接应用
      await applyTemplate(template, false);
    } catch (error) {
      console.error(`❌ 模板选择处理失败:`, error);
    }
  };

  // 应用模板的核心逻辑
  const applyTemplate = async (template: string, replace: boolean) => {
    try {
      console.log(
        `🎯 开始处理模板选择: ${template}, 当前语言: ${i18n.locale}, 选择语言: ${selectedLanguage}, 替换模式: ${replace}`,
      );

      // 首先更新模板样式
      setValue("metadata.template", template);
      console.log(`📋 已更新模板设置为: ${template}`);

      // 决定使用哪种语言的模板数据
      let targetLocale = selectedLanguage === "zh" ? "zh" : "en";
      
      // 如果用户选择了"all"，则根据系统语言决定
      if (selectedLanguage === "all") {
        targetLocale = i18n.locale?.startsWith("zh") ? "zh" : "en";
      }

      // 加载模板数据并应用
      const templateData = await loadTemplateData(template, targetLocale);
      if (templateData) {
        console.log(`🔄 开始应用模板数据，替换模式: ${replace}...`);
        applyTemplateData(setValue, currentData, templateData, replace);
        console.log(`🎉 模板 ${template} 应用完成！`);
      } else {
        console.warn(`⚠️ 无法加载模板数据: ${template}`);
      }
    } catch (error) {
      console.error(`❌ 模板应用失败:`, error);
    }
  };

  // 确认应用模板
  const handleConfirmApply = async () => {
    await applyTemplate(pendingTemplate, replaceContent);
    setShowConfirmDialog(false);
    setPendingTemplate("");
    setReplaceContent(false);
  };

  // 取消应用
  const handleCancelApply = () => {
    setShowConfirmDialog(false);
    setPendingTemplate("");
    setReplaceContent(false);
  };

  return (
    <>
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
                  ? "点击任意模板应用中文内容和样式。如果您已有内容，系统会询问是否要替换现有内容。"
                  : "Click any template to apply Chinese content and styling. If you have existing content, you'll be asked whether to replace it."
                }
              </>
            )}
            {selectedLanguage === "en" && (
              <>
                {i18n.locale?.startsWith("zh")
                  ? "点击任意模板应用英文内容和样式。如果您已有内容，系统会询问是否要替换现有内容。"
                  : "Click any template to apply English content and styling. If you have existing content, you'll be asked whether to replace it."
                }
              </>
            )}
            {selectedLanguage === "all" && (
              <>
                {i18n.locale?.startsWith("zh")
                  ? "点击任意模板应用内容和样式。语言将基于您的系统设置。"
                  : t`Click any template to apply content and styling. Language will be based on your system settings.`
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

      {/* 确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {i18n.locale?.startsWith("zh") ? "应用模板内容" : t`Apply Template Content`}
            </DialogTitle>
            <DialogDescription>
              {i18n.locale?.startsWith("zh") 
                ? "您的简历中已有内容。您希望如何应用模板？"
                : t`You have existing content in your resume. How would you like to apply the template?`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="replace-content"
                checked={replaceContent}
                onCheckedChange={setReplaceContent}
              />
              <label htmlFor="replace-content" className="text-sm">
                {replaceContent ? (
                  <>
                    <strong>
                      {i18n.locale?.startsWith("zh") ? "替换现有内容" : t`Replace existing content`}
                    </strong>
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {i18n.locale?.startsWith("zh")
                        ? "所有当前内容将被模板内容替换。"
                        : t`All your current content will be replaced with template content.`
                      }
                    </span>
                  </>
                ) : (
                  <>
                    <strong>
                      {i18n.locale?.startsWith("zh") ? "只填充空字段" : t`Fill empty fields only`}
                    </strong>
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {i18n.locale?.startsWith("zh")
                        ? "模板内容只会添加到空字段中。"
                        : t`Template content will only be added to empty fields.`
                      }
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelApply}>
              {i18n.locale?.startsWith("zh") ? "取消" : t`Cancel`}
            </Button>
            <Button onClick={handleConfirmApply}>
              {i18n.locale?.startsWith("zh") ? "应用模板" : t`Apply Template`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
