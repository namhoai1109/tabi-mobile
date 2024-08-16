import { AxiosResponse } from "axios"
import { authNotificationRequest } from "../axios"
import { CHANGE_NOTIFICATION_SETTING_PATH, DEVICE_PATH } from "./paths"

export const createDevice = async (data: TCreateDeviceRequest) => {
  return authNotificationRequest.post(DEVICE_PATH, data)
}

export const changeNotificationSetting = async (data: TChangeNotificationSettingRequest) => {
  return authNotificationRequest.patch<any, AxiosResponse<any>, TChangeNotificationSettingRequest>(
    CHANGE_NOTIFICATION_SETTING_PATH,
    data,
  )
}

export const getDevice = async (push_token: string) => {
  return authNotificationRequest.get<any, AxiosResponse<TDeviceModel>>(
    DEVICE_PATH + `/${encodeURIComponent(push_token)}`,
  )
}
