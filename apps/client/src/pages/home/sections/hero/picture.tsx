import { t } from "@lingui/macro";

export const HeroPicture = () => (
  <div className="relative">
    <div className="aspect-video overflow-hidden rounded-lg bg-background/5 shadow-2xl ring-1 ring-foreground/10">
      <img
        alt={t`王者简历平台界面预览`}
        className="size-full object-cover object-center"
        src="/screenshots/builder.jpg"
      />
    </div>

    {/* Decorative elements */}
    <div className="absolute -right-4 -top-4 size-12 rounded-full bg-primary/10 blur-sm" />
    <div className="bg-accent/20 absolute -bottom-4 -left-4 size-8 rounded-full blur-sm" />
  </div>
);
