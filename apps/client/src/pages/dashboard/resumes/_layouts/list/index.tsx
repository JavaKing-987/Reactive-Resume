import { t } from "@lingui/macro";
import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";

import { useResumes } from "@/client/services/resume";
import { useUser } from "@/client/services/user";

import { BaseListItem } from "./_components/base-item";
import { CreateResumeListItem } from "./_components/create-item";
import { ImportResumeListItem } from "./_components/import-item";
import { ResumeListItem } from "./_components/resume-item";

export const ListView = () => {
  const { resumes, loading } = useResumes();
  const { user, loading: userLoading } = useUser();

  // 如果用户数据还在加载中，显示加载状态
  if (userLoading) {
    return (
      <div className="grid gap-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 100}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}
      </div>
    );
  }

  // 如果用户未登录，显示登录提示
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <h2 className="text-2xl font-bold">{t`Welcome to 王者简历`}</h2>
          <p className="text-muted-foreground max-w-md">
            {t`To create and manage your resumes, please sign in to your account or create a new one.`}
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/auth/login"
              className="rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t`Sign In`}
            </Link>
            <Link
              to="/auth/register"
              className="hover:bg-accent rounded-md border border-border px-6 py-2 transition-colors"
            >
              {t`Create Account`}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 用户已登录，显示正常的简历列表
  return (
    <div className="grid gap-y-2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreateResumeListItem />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
      >
        <ImportResumeListItem />
      </motion.div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {resumes && (
        <AnimatePresence>
          {resumes
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <ResumeListItem resume={resume} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
