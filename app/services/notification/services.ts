import { useMutation, useQuery } from "react-query"
import { changeNotificationSetting, createDevice, getDevice } from "./callers"

export const keyNotification = {
  device: "DEVICE",
}

export const useCreateDevice = () => {
  return useMutation({
    mutationFn: (data: TCreateDeviceRequest) => createDevice(data),
  })
}

export const useChangeNotificationSetting = () => {
  return useMutation({
    mutationFn: (changeNotificationSettingReq: TChangeNotificationSettingRequest) =>
      changeNotificationSetting(changeNotificationSettingReq),
  })
}

export const useGetDevices = (push_token: string) => {
  return useQuery({
    queryKey: [keyNotification.device, push_token],
    queryFn: () => getDevice(push_token),
    onError(err) {
      console.error(err)
    },
  })
}
