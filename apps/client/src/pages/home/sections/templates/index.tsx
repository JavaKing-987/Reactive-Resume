import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { getFilteredTemplates } from "@reactive-resume/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export const TemplatesSection = () => {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale;
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // 根据语言动态过滤模板 - 支持语言切换时自动更新
  const filteredTemplates = useMemo(() => {
    return getFilteredTemplates(currentLocale);
  }, [currentLocale]);

  // 监听语言切换事件，重置图片错误状态
  useEffect(() => {
    const handleLocaleChange = () => {
      setImageErrors(new Set()); // 重置图片错误状态
    };

    window.addEventListener("locale-changed", handleLocaleChange);
    return () => {
      window.removeEventListener("locale-changed", handleLocaleChange);
    };
  }, []);

  // 根据语言决定使用哪种图片
  const getImagePath = (template: string) => {
    const isChinese = currentLocale?.startsWith("zh");
    // 如果中文图片加载失败，或者不是中文用户，则使用英文图片
    if (imageErrors.has(template) || !isChinese) {
      return `/templates/jpg/${template}.jpg`;
    }
    return `/templates/jpg/${template}-zh.jpg`;
  };

  const handleImageError = (template: string) => {
    setImageErrors((prev) => new Set(prev).add(template));
  };

  return (
    <section id="sample-resumes" className="relative py-24 sm:py-32">
      <div className="container flex flex-col gap-12 lg:min-h-[600px] lg:flex-row lg:items-start">
        <div className="space-y-4 lg:mt-16 lg:basis-96">
          <h2 className="text-4xl font-bold">{t`Templates`}</h2>

          <p className="leading-relaxed">
            {t`Explore the beautiful templates available in our platform and view the resumes crafted with them. These examples can help guide the creation of your next professional resume.`}
          </p>
        </div>

        <div className="w-full overflow-hidden lg:absolute lg:right-0 lg:max-w-[55%]">
          <motion.div
            animate={{
              x: [0, filteredTemplates.length * 200 * -1],
              transition: {
                x: {
                  duration: 30,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                },
              },
            }}
            className="flex items-center gap-x-6"
          >
            {filteredTemplates.map((template, index) => (
              <motion.a
                key={`${template}-${currentLocale}`} // 添加locale到key以强制重新渲染
                target="_blank"
                rel="noreferrer"
                href={`templates/pdf/${template}.pdf`}
                className="max-w-none flex-none"
                viewport={{ once: true }}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <img
                  alt={template}
                  loading="lazy"
                  src={getImagePath(template)}
                  className="aspect-[1/1.4142] h-[400px] rounded object-cover lg:h-[600px]"
                  onError={() => {
                    handleImageError(template);
                  }}
                />
              </motion.a>
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-background to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
};
