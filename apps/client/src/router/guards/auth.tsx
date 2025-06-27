import { Navigate, Outlet, useLocation } from "react-router";

import { useUser } from "@/client/services/user";

export const AuthGuard = () => {
  const location = useLocation();
  const redirectTo = location.pathname + location.search;

  const { user, loading } = useUser();

  if (loading) return null;

  if (user) {
    return <Outlet />;
  }

  return <Navigate replace to={`/auth/login?redirect=${redirectTo}`} />;
};

// 新增：允许游客访问的保护组件 - 支持本地简历数据存储
export const GuestAllowedGuard = () => {
  const { user, loading } = useUser();

  if (loading) return null;

  // 登录用户和游客用户都允许访问
  return <Outlet />;
};
