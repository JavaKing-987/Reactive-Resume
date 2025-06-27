import type { UserDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useEffect } from "react";

import { axios } from "@/client/libs/axios";
import { useAuthStore } from "@/client/stores/auth";

export const fetchUser = async (): Promise<UserDto | null> => {
  try {
    const response = await axios.get<UserDto | undefined, AxiosResponse<UserDto | undefined>>(
      "/user/me",
    );

    return response.data || null;
  } catch (error: any) {
    // 如果是 401 错误，表示用户未认证，返回 null 而不是抛出错误
    if (error.response?.status === 401) {
      return null;
    }
    // 对于其他错误，继续抛出
    throw error;
  }
};

export const useUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    data: user,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: (failureCount, error: any) => {
      // 如果是 401 错误，不重试
      if (error?.response?.status === 401) {
        return false;
      }
      // 其他错误最多重试 1 次
      return failureCount < 1;
    },
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 分钟
    gcTime: 1000 * 60 * 10, // 10 分钟
  });

  useEffect(() => {
    setUser(user ?? null);
  }, [user, setUser]);

  return { user: user, loading, error };
};
