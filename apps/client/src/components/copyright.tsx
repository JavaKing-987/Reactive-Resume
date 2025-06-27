import { cn } from "@reactive-resume/utils";

import { getBrandName } from "@/client/libs/brand";

type Props = {
  className?: string;
};

export const Copyright = ({ className }: Props) => (
  <div
    className={cn(
      "prose prose-sm prose-zinc flex max-w-none flex-col gap-y-1 text-xs opacity-40 dark:prose-invert",
      className,
    )}
  >
    <span className="mt-4">
      {getBrandName()} {"v" + appVersion}
    </span>
  </div>
);
