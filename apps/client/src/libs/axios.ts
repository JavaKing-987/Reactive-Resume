import { t } from "@lingui/macro";
import type { ErrorMessage } from "@reactive-resume/utils";
import { deepSearchAndParseDates } from "@reactive-resume/utils";
import _axios from "axios";

import { toast } from "../hooks/use-toast";
import { translateError } from "../services/errors/translate-error";

export const axios = _axios.create({ baseURL: "/api", withCredentials: true });

// Intercept responses to transform ISO dates to JS date objects
axios.interceptors.response.use(
  (response) => {
    const transformedResponse = deepSearchAndParseDates(response.data, ["createdAt", "updatedAt"]);
    return { ...response, data: transformedResponse };
  },
  (error) => {
    // 如果是 401 错误，不显示错误提示，让上层代码处理
    if (error.response?.status === 401) {
      // 401 错误 - 用户未认证，正常情况，不需要记录
      return Promise.reject(error);
    }

    const message = error.response?.data.message as ErrorMessage;
    const description = translateError(message);

    if (description) {
      toast({
        variant: "error",
        title: t`Oops, the server returned an error.`,
        description,
      });
    }

    return Promise.reject(error);
  },
);

// 注释掉认证刷新拦截器，让服务层处理认证
// import createAuthRefreshInterceptor from "axios-auth-refresh";
// import { refreshToken } from "@/client/services/auth";

// const axiosForRefresh = _axios.create({ baseURL: "/api", withCredentials: true });
// const handleAuthError = async () => refreshToken(axiosForRefresh);
// const handleRefreshError = async () => {
//   await queryClient.invalidateQueries({ queryKey: ["user"] });
//   redirect("/auth/login");
// };
// createAuthRefreshInterceptor(axios, handleAuthError, { statusCodes: [401, 403] });
// createAuthRefreshInterceptor(axiosForRefresh, handleRefreshError);
