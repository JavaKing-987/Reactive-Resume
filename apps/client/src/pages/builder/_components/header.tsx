import { t } from "@lingui/macro";
import { CircleNotch, FilePdf, HouseSimple, Lock, SidebarSimple } from "@phosphor-icons/react";
import { Button, Tooltip } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { Link } from "react-router";

import { usePrintResume } from "@/client/services/resume/print";
import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore } from "@/client/stores/resume";

const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const BuilderHeader = () => {
  const title = useResumeStore((state) => state.resume.title);
  const locked = useResumeStore((state) => state.resume.locked);
  const resumeId = useResumeStore((state) => state.resume.id);

  const toggle = useBuilderStore((state) => state.toggle);
  const isDragging = useBuilderStore(
    (state) => state.panel.left.handle.isDragging || state.panel.right.handle.isDragging,
  );
  const leftPanelSize = useBuilderStore((state) => state.panel.left.size);
  const rightPanelSize = useBuilderStore((state) => state.panel.right.size);

  const { printResume, loading } = usePrintResume();

  const onToggle = (side: "left" | "right") => {
    toggle(side);
  };

  const onPdfExport = async () => {
    const { url } = await printResume({ id: resumeId });
    openInNewTab(url);
  };

  return (
    <div
      style={{ left: `${leftPanelSize}%`, right: `${rightPanelSize}%` }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-16 bg-secondary-accent/50 backdrop-blur-lg lg:z-20",
        !isDragging && "transition-[left,right]",
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <Button
          size="icon"
          variant="ghost"
          className="flex lg:hidden"
          onClick={() => {
            onToggle("left");
          }}
        >
          <SidebarSimple />
        </Button>

        <div className="flex items-center justify-center gap-x-1 lg:mx-auto">
          <Button asChild size="icon" variant="ghost">
            <Link to="/dashboard/resumes">
              <HouseSimple />
            </Link>
          </Button>

          <span className="mr-2 text-xs opacity-40">{"/"}</span>

          <h1 className="font-medium">{title}</h1>

          {locked && (
            <Tooltip content={t`This resume is locked, please unlock to make further changes.`}>
              <Lock size={14} className="ml-2 opacity-75" />
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          {/* PDF 导出按钮 */}
          <Tooltip content={t`Export PDF`}>
            <Button
              size="icon"
              variant="ghost"
              disabled={loading}
              onClick={onPdfExport}
              className="hidden sm:flex"
            >
              {loading ? <CircleNotch size={18} className="animate-spin" /> : <FilePdf size={18} />}
            </Button>
          </Tooltip>

          <Button
            size="icon"
            variant="ghost"
            className="flex lg:hidden"
            onClick={() => {
              onToggle("right");
            }}
          >
            <SidebarSimple className="-scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  );
};
