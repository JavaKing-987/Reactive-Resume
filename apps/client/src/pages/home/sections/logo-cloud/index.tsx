import { t } from "@lingui/macro";
import { cn } from "@reactive-resume/utils";

import { getBrandName } from "@/client/libs/brand";

type LogoProps = { company: string };

const Logo = ({ company }: LogoProps) => (
  <div
    className={cn(
      "col-span-2 col-start-2 sm:col-start-auto lg:col-span-1",
      company === "twilio" && "sm:col-start-2",
    )}
  >
    {/* Show on Light Theme */}
    <img
      className="block max-h-12 object-contain dark:hidden"
      src={`/brand-logos/dark/${company}.svg`}
      alt={company}
      width={212}
      height={48}
    />
    {/* Show on Dark Theme */}
    <img
      className="hidden max-h-12 object-contain dark:block"
      src={`/brand-logos/light/${company}.svg`}
      alt={company}
      width={212}
      height={48}
    />
  </div>
);

const logoList: string[] = ["amazon", "google", "postman", "twilio", "zalando"];

export const LogoCloudSection = () => (
  <section id="logo-cloud" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <p className="text-center text-lg leading-relaxed">
        {t`${getBrandName()} has helped professionals land jobs at these great companies:`}
      </p>
      <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        {logoList.map((company) => (
          <Logo key={company} company={company} />
        ))}
      </div>
    </div>
  </section>
);
