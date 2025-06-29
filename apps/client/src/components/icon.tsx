import { useTheme } from "@reactive-resume/hooks";
import { cn } from "@reactive-resume/utils";

import { getBrandName } from "@/client/libs/brand";

type IconProps = {
  size?: number;
  className?: string;
};

export const Icon = ({ size = 32, className }: IconProps) => {
  const { isDarkMode } = useTheme();

  let src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  switch (isDarkMode) {
    case false: {
      src = "/icon/dark.svg";
      break;
    }
    case true: {
      src = "/icon/light.svg";
      break;
    }
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={getBrandName()}
      className={cn("rounded-sm", className)}
    />
  );
};
