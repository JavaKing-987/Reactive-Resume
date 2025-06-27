// 游客用户本地存储服务 - 支持简历数据临时保存
import { createId } from "@paralleldrive/cuid2";
import type { CreateResumeDto } from "@reactive-resume/dto";

const GUEST_RESUMES_KEY = "guest-resumes";
const GUEST_CURRENT_RESUME_KEY = "guest-current-resume";
const GUEST_USER_KEY = "guest-user";

// 游客用户临时数据结构
export type GuestUser = {
  id: string;
  name: string;
  email?: string;
  locale: string;
  createdAt: string;
};

export type GuestResume = {
  id: string;
  title: string;
  slug?: string;
  data: any; // Resume data structure
  visibility: "public" | "private";
  createdAt: string;
  updatedAt: string;
};

// 游客用户管理
export const guestUserService = {
  // 获取当前游客用户
  getGuestUser(): GuestUser | null {
    try {
      const stored = localStorage.getItem(GUEST_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // 创建游客用户
  createGuestUser(locale = "zh-CN"): GuestUser {
    const guestUser: GuestUser = {
      id: createId(),
      name: "游客用户",
      locale,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  // 更新游客用户信息
  updateGuestUser(updates: Partial<GuestUser>): GuestUser | null {
    const current = this.getGuestUser();
    if (!current) return null;

    const updated = { ...current, ...updates };
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  // 清除游客用户数据
  clearGuestUser(): void {
    localStorage.removeItem(GUEST_USER_KEY);
    localStorage.removeItem(GUEST_RESUMES_KEY);
    localStorage.removeItem(GUEST_CURRENT_RESUME_KEY);
  },
};

// 游客简历管理
export const guestResumeService = {
  // 获取所有游客简历
  getGuestResumes(): GuestResume[] {
    try {
      const stored = localStorage.getItem(GUEST_RESUMES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // 获取特定简历
  getGuestResume(id: string): GuestResume | null {
    const resumes = this.getGuestResumes();
    return resumes.find((resume) => resume.id === id) || null;
  },

  // 创建新的游客简历
  createGuestResume(data: Partial<CreateResumeDto> & { data?: any }): GuestResume {
    const newResume: GuestResume = {
      id: createId(),
      title: data.title || "未命名简历",
      slug: data.slug,
      data: data.data || {},
      visibility: data.visibility || "private",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const resumes = this.getGuestResumes();
    resumes.push(newResume);
    localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes));

    // 设置为当前简历
    this.setCurrentResume(newResume.id);

    return newResume;
  },

  // 更新游客简历
  updateGuestResume(
    id: string,
    updates: Partial<Omit<GuestResume, "id" | "createdAt">>,
  ): GuestResume | null {
    const resumes = this.getGuestResumes();
    const index = resumes.findIndex((resume) => resume.id === id);

    if (index === -1) return null;

    resumes[index] = {
      ...resumes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes));
    return resumes[index];
  },

  // 删除游客简历
  deleteGuestResume(id: string): boolean {
    const resumes = this.getGuestResumes();
    const filtered = resumes.filter((resume) => resume.id !== id);

    if (filtered.length === resumes.length) return false;

    localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(filtered));

    // 如果删除的是当前简历，清除当前简历设置
    const currentId = this.getCurrentResumeId();
    if (currentId === id) {
      this.clearCurrentResume();
    }

    return true;
  },

  // 设置当前简历
  setCurrentResume(id: string): void {
    localStorage.setItem(GUEST_CURRENT_RESUME_KEY, id);
  },

  // 获取当前简历ID
  getCurrentResumeId(): string | null {
    return localStorage.getItem(GUEST_CURRENT_RESUME_KEY);
  },

  // 获取当前简历
  getCurrentResume(): GuestResume | null {
    const id = this.getCurrentResumeId();
    return id ? this.getGuestResume(id) : null;
  },

  // 清除当前简历设置
  clearCurrentResume(): void {
    localStorage.removeItem(GUEST_CURRENT_RESUME_KEY);
  },

  // 复制简历
  duplicateGuestResume(id: string): GuestResume | null {
    const original = this.getGuestResume(id);
    if (!original) return null;

    const duplicated: GuestResume = {
      ...original,
      id: createId(),
      title: `${original.title} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const resumes = this.getGuestResumes();
    resumes.push(duplicated);
    localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes));

    return duplicated;
  },
};

// 数据同步服务 - 登录后将本地数据同步到账户
export const guestSyncService = {
  // 获取需要同步的数据
  getDataForSync(): {
    user: GuestUser | null;
    resumes: GuestResume[];
  } {
    return {
      user: guestUserService.getGuestUser(),
      resumes: guestResumeService.getGuestResumes(),
    };
  },

  // 标记数据已同步（保留一段时间后清理）
  markSynced(): void {
    const syncTimestamp = new Date().toISOString();
    localStorage.setItem("guest-data-synced", syncTimestamp);

    // 7天后自动清理游客数据
    setTimeout(
      () => {
        const stored = localStorage.getItem("guest-data-synced");
        if (stored === syncTimestamp) {
          this.clearGuestData();
        }
      },
      7 * 24 * 60 * 60 * 1000,
    );
  },

  // 清理游客数据
  clearGuestData(): void {
    guestUserService.clearGuestUser();
    localStorage.removeItem("guest-data-synced");
  },

  // 检查是否有未同步的数据
  hasUnsyncedData(): boolean {
    const resumes = guestResumeService.getGuestResumes();
    const synced = localStorage.getItem("guest-data-synced");
    return resumes.length > 0 && !synced;
  },
};
