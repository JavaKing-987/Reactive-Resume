import { t } from "@lingui/macro";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui";
import { Link } from "react-router";

export const HeroActions = () => (
  <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
    <Button asChild size="lg" className="group">
      <Link to="/auth/register">
        {t`开始创建简历`}
        <ArrowRight 
          size={16} 
          className="ml-2 transition-transform group-hover:translate-x-1" 
        />
      </Link>
    </Button>
    
    <Button asChild variant="outline" size="lg">
      <Link to="/dashboard/resumes">
        {t`查看模板`}
      </Link>
    </Button>
  </div>
); 