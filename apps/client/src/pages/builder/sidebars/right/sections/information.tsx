import { t } from "@lingui/macro";
import { Book, EnvelopeSimpleOpen } from "@phosphor-icons/react";
import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

const DonateCard = () => null;

const IssuesCard = () => null;

const DocumentationCard = () => (
  <Card className="space-y-4 bg-primary text-primary-foreground">
    <CardContent className="space-y-2">
      <CardTitle>{t`Having trouble with building your resume?`}</CardTitle>
      <CardDescription>
        {t`I've prepared a comprehensive documentation that should help you with any challenges you might face while using the app. If you can't find the answer to your question, you can reach out to me directly via email.`}
      </CardDescription>
    </CardContent>
    <CardFooter className="flex gap-x-2">
      <a
        href="https://docs.rxresu.me"
        className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        <Book size={14} weight="bold" className="mr-2" />
        <span className="line-clamp-1">{t`Documentation`}</span>
      </a>
      <a
        href="mailto:hello@amruthpillai.com"
        className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        <EnvelopeSimpleOpen size={14} weight="bold" className="mr-2" />
        <span className="line-clamp-1">{t`Email`}</span>
      </a>
    </CardFooter>
  </Card>
);

export const InformationSection = () => {
  const onSendMessage = () => {
    const subject = encodeURIComponent("王者简历 - 简历制作帮助");
    const body = encodeURIComponent(
      "您好！\n\n我在使用王者简历制作简历时遇到了问题，希望能得到帮助。\n\n问题描述：\n\n\n感谢您的帮助！",
    );
    window.open(`mailto:support@kingjin.com?subject=${subject}&body=${body}`, "_blank");
  };

  // 隐藏问题求助部分 - 根据用户要求
  return null;

  // 注释掉原来的内容
  /*
  return (
    <section id="information" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SectionIcon id="information" name={t`Information`} />
          <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">{t`Information`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <Card>
          <CardContent className="grid gap-y-3">
            <CardTitle>{t`Having trouble with building your resume?`}</CardTitle>

            <p className="leading-relaxed opacity-75">
              {t`You can reach out to me through email, or on the other platforms mentioned in the footer below. I would be happy to help you out with any questions you might have about the project.`}
            </p>

            <Button variant="outline" onClick={onSendMessage}>
              {t`Send me a message`}
            </Button>
          </CardContent>
        </Card>
      </main>
    </section>
  );
  */
};
