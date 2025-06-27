import { t } from "@lingui/macro";
import { createId } from "@paralleldrive/cuid2";
import type { ResumeDto } from "@reactive-resume/dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestState = {
  guestResumes: ResumeDto[];
  currentGuestResume: ResumeDto | null;
};

type GuestActions = {
  addGuestResume: (resume: ResumeDto) => void;
  updateGuestResume: (resume: ResumeDto) => void;
  deleteGuestResume: (id: string) => void;
  setCurrentGuestResume: (resume: ResumeDto | null) => void;
  clearGuestData: () => void;
  syncToAccount: (userId: string) => Promise<void>;
};

// 创建默认的简历数据
const createDefaultResume = (): Omit<ResumeDto, 'userId' | 'createdAt' | 'updatedAt'> => ({
  id: createId(),
  title: t`我的简历`,
  slug: "my-resume",
  visibility: "private" as const,
  locked: false,
  data: {
    basics: {
      name: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      url: {
        label: "",
        href: "",
      },
      customFields: [],
      picture: {
        url: "",
        size: 64,
        aspectRatio: 1,
        borderRadius: 0,
        effects: {
          hidden: false,
          border: false,
          grayscale: false,
        },
      },
    },
    sections: {
      summary: {
        name: "个人简介",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "summary",
        content: "",
      },
      experience: {
        name: "工作经历",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "experience",
        items: [],
      },
      education: {
        name: "教育背景",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "education",
        items: [],
      },
      skills: {
        name: "技能",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "skills",
        items: [],
      },
      languages: {
        name: "语言能力",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "languages",
        items: [],
      },
      projects: {
        name: "项目经验",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "projects",
        items: [],
      },
      certifications: {
        name: "证书",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "certifications",
        items: [],
      },
      awards: {
        name: "奖项",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "awards",
        items: [],
      },
      publications: {
        name: "发表作品",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "publications",
        items: [],
      },
      volunteer: {
        name: "志愿活动",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "volunteer",
        items: [],
      },
      interests: {
        name: "兴趣爱好",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "interests",
        items: [],
      },
      references: {
        name: "推荐人",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "references",
        items: [],
      },
      profiles: {
        name: "社交资料",
        columns: 1,
        separateLinks: true,
        visible: true,
        id: "profiles",
        items: [],
      },
      custom: {},
    },
    metadata: {
      template: "azurill",
      layout: [
        [
          ["basics", "profiles", "summary", "experience"],
          ["skills", "education", "projects", "certifications"],
        ],
      ],
      css: {
        value: "",
        visible: false,
      },
      page: {
        margin: 18,
        format: "a4" as const,
        options: {
          breakLine: true,
          pageNumbers: true,
        },
      },
      theme: {
        background: "#ffffff",
        text: "#000000",
        primary: "#dc2626",
      },
      typography: {
        font: {
          family: "IBM Plex Serif",
          subset: "latin",
          variants: ["400", "600"],
          size: 14,
        },
        lineHeight: 1.5,
        hideIcons: false,
        underlineLinks: true,
      },
      notes: "",
    },
  },
});

export const useGuestStore = create<GuestState & GuestActions>()(
  persist(
    (set, get) => ({
      guestResumes: [],
      currentGuestResume: null,

      addGuestResume: (resume) => {
        set((state) => ({
          guestResumes: [...state.guestResumes, resume],
        }));
      },

      updateGuestResume: (resume) => {
        set((state) => ({
          guestResumes: state.guestResumes.map((r) => (r.id === resume.id ? resume : r)),
          currentGuestResume: state.currentGuestResume?.id === resume.id ? resume : state.currentGuestResume,
        }));
      },

      deleteGuestResume: (id) => {
        set((state) => ({
          guestResumes: state.guestResumes.filter((r) => r.id !== id),
          currentGuestResume: state.currentGuestResume?.id === id ? null : state.currentGuestResume,
        }));
      },

      setCurrentGuestResume: (resume) => {
        set({ currentGuestResume: resume });
      },

      clearGuestData: () => {
        set({
          guestResumes: [],
          currentGuestResume: null,
        });
      },

      syncToAccount: async (userId) => {
        // 这里将实现同步逻辑，将游客数据同步到用户账户
        const { guestResumes } = get();
        
        // TODO: 实现API调用，将guestResumes同步到用户账户
        await Promise.resolve(); // 占位符，防止linter警告
        
        // 同步完成后清除游客数据
        set({
          guestResumes: [],
          currentGuestResume: null,
        });
      },
    }),
    {
      name: "guest-data",
      partialize: (state) => ({
        guestResumes: state.guestResumes,
        currentGuestResume: state.currentGuestResume,
      }),
    },
  ),
);

// 创建新的游客简历
export const createGuestResume = (): ResumeDto => {
  const defaultResume = createDefaultResume();
  const now = new Date();
  return {
    ...defaultResume,
    userId: "guest",
    createdAt: now,
    updatedAt: now,
  };
};