import { t } from "@lingui/macro";
import { Link } from "react-router";

import { Copyright } from "@/client/components/copyright";
import { Icon } from "@/client/components/icon";
import { LocaleSwitch } from "@/client/components/locale-switch";
import { ThemeSwitch } from "@/client/components/theme-switch";
import { getBrandName } from "@/client/libs/brand";

export const Footer = () => (
  <footer className="bg-background py-12">
    <div className="container grid gap-8 lg:grid-cols-4">
      <div className="flex flex-col space-y-4 lg:col-span-2">
        <div className="flex items-center space-x-2">
          <Icon size={24} />
          <h2 className="text-xl font-medium">{getBrandName()}</h2>
        </div>

        <p className="leading-relaxed opacity-60">
          {t`Create beautiful, professional resumes in minutes with our intuitive resume builder. Stand out from the crowd and land your dream job.`}
        </p>

        <Copyright />
      </div>

      <div className="relative col-start-4 flex flex-col items-end justify-end">
        <div className="mb-14 space-y-6 text-right">
          <a
            className="block"
            href="https://www.digitalocean.com/?utm_medium=opensource&utm_source=Reactive-Resume"
          >
            <img
              src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_black.svg"
              alt="Powered by DigitalOcean"
              className="block dark:hidden"
              width="150px"
            />
            <img
              src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_white.svg"
              alt="Powered by DigitalOcean"
              className="hidden dark:block"
              width="150px"
            />
          </a>

          <Link
            to="/meta/privacy-policy"
            className="block text-sm font-medium"
          >{t`Privacy Policy`}</Link>
        </div>

        <div className="absolute bottom-0 right-0 lg:space-x-2">
          <LocaleSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </div>
  </footer>
);
