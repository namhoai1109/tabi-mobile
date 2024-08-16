import React from "react"
import { Toast } from "@ant-design/react-native"
import { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosInstance } from "axios"
import _get from "lodash/get"
import { loadString, storageKey } from "app/utils/storage"
import { logout } from "app/hooks/useAuthentication"
import { translate } from "app/i18n"
import { ToastContent } from "app/components/core"

const responseInterceptor = (response: AxiosResponse<any, any>) => {
  return response
}

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers.set("Content-Type", "application/json")
  console.info("request API ", `${config.baseURL}${config.url}`)
  return config
}

const requestTokenInterceptor = async (config: InternalAxiosRequestConfig) => {
  const accessToken = await loadString(storageKey.ACCESS_TOKEN)
  if (accessToken) {
    config.headers.set("Authorization", accessToken)
  }
  config.headers.set("Content-Type", "application/json")
  console.info("request API ", `${config.baseURL}${config.url}`)
  return config
}

const handleErrorInterceptor = (error: TErrorResponse | AxiosError) => {
  const messageServer = _get(error, "response.data.error.message", "")
  const codeServer = _get(error, "response.data.error.code", 0)
  const messageAxios = _get(error, "message", "")
  const codeAxios = _get(error, "code", "")

  if (codeServer && codeServer === 401 && messageServer.includes("expired")) {
    Toast.fail({
      content: <ToastContent message={translate("errors.tokenExpired")} />,
      duration: 1,
    })
    logout()
  } else {
    if (codeAxios && codeAxios === "ERR_NETWORK") {
      Toast.offline({
        content: <ToastContent code={codeAxios} message={messageAxios} />,
        duration: 1,
      })
    } else {
      Toast.fail({
        content: <ToastContent code={codeServer} message={messageServer} />,
        duration: 1,
      })
    }
  }

  return Promise.reject(error)
}

export const useInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(responseInterceptor, handleErrorInterceptor)
  axiosInstance.interceptors.request.use(requestInterceptor)
}

export const useTokenInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(responseInterceptor, handleErrorInterceptor)
  axiosInstance.interceptors.request.use(requestTokenInterceptor)
}
