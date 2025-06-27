/* eslint-disable lingui/text-restrictions */
/* eslint-disable lingui/no-unlocalized-strings */

import { t } from "@lingui/macro";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@reactive-resume/ui";

import { getBrandName } from "@/client/libs/brand";

// 什么是王者简历？
const Question1 = () => (
  <AccordionItem value="1">
    <AccordionTrigger className="text-left leading-relaxed">
      {t`What is ${getBrandName()}?`}
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
        {t`${getBrandName()} is a professional resume builder designed to help you create beautiful, modern resumes quickly and easily. Our platform offers a variety of templates and tools to showcase your skills and experience effectively.`}
      </p>
      <p>
        {t`With our intuitive interface, you can build a professional resume in minutes, not hours. Whether you're a recent graduate or an experienced professional, our platform adapts to your needs.`}
      </p>
    </AccordionContent>
  </AccordionItem>
);

// 平台是否免费使用？
const Question2 = () => (
  <AccordionItem value="2">
    <AccordionTrigger className="text-left leading-relaxed">
      {t`Is the platform free to use?`}
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
        {t`Yes! ${getBrandName()} is completely free to use. You can create, edit, and download your resume without any charges or hidden fees.`}
      </p>
      <p>
        {t`We believe everyone deserves access to professional resume building tools, regardless of their financial situation.`}
      </p>
    </AccordionContent>
  </AccordionItem>
);

// 支持哪些语言？
const Question3 = () => (
  <AccordionItem value="3">
    <AccordionTrigger className="text-left leading-relaxed">
      {t`What languages are supported?`}
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
        {t`${getBrandName()} supports multiple languages including English, Chinese (Simplified), Chinese (Traditional), and many others.`}
      </p>
      <p>
        {t`The platform automatically detects your preferred language and displays content accordingly. You can also manually switch languages at any time.`}
      </p>
    </AccordionContent>
  </AccordionItem>
);

// 如何导出简历？
const Question4 = () => (
  <AccordionItem value="4">
    <AccordionTrigger className="text-left leading-relaxed">
      {t`How can I export my resume?`}
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
        {t`You can export your resume as a PDF file with just one click. The PDF maintains all the formatting and styling of your chosen template.`}
      </p>
      <p>
        {t`Simply click the download button in the resume builder, and your professionally formatted resume will be ready to share with potential employers.`}
      </p>
    </AccordionContent>
  </AccordionItem>
);

// 数据安全如何保证？
const Question5 = () => (
  <AccordionItem value="5">
    <AccordionTrigger className="text-left leading-relaxed">
      {t`How secure is my data?`}
    </AccordionTrigger>
    <AccordionContent className="prose max-w-none dark:prose-invert">
      <p>
        {t`Your data security is our top priority. All information is encrypted and stored securely. We never share your personal information with third parties.`}
      </p>
      <p>
        {t`You have full control over your data and can delete your account and all associated information at any time.`}
      </p>
    </AccordionContent>
  </AccordionItem>
);

export const FAQSection = () => (
  <section id="faq" className="relative py-24 sm:py-32">
    <div className="container space-y-12">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold">{t`Frequently Asked Questions`}</h1>
        <p className="mx-auto max-w-2xl leading-relaxed opacity-60">
          {t`Here are some common questions about ${getBrandName()}. If you have other questions, feel free to contact us.`}
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion collapsible type="single">
          <Question1 />
          <Question2 />
          <Question3 />
          <Question4 />
          <Question5 />
        </Accordion>
      </div>
    </div>
  </section>
);
