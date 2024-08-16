import * as Notifications from "expo-notifications"
// import * as Device from "expo-device"
import Constants from "expo-constants"
import { Platform } from "react-native"
import { useEffect, useRef } from "react"
import { proxy, useSnapshot } from "valtio"
import * as Device from "expo-device"

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage)
  throw new Error(errorMessage)
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted to get push token for push notification!")
      return ""
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError("Project ID not found")
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
      return pushTokenString
    } catch (e: unknown) {
      handleRegistrationError(`${e}`)
    }
  }

  return ""
}

export const deviceState = proxy<TCreateDeviceRequest>({
  push_token: "",
  brand: Device.brand || "",
  model: Device.modelName || "",
  os: Device.osName || "",
  os_version: Device.osVersion || "",
})

export const setDevice = (value: TCreateDeviceRequest) => {
  Object.assign(deviceState, value)
}

export const useDevice = () => {
  return useSnapshot(deviceState)
}

export const useNotification = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })

  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    ;(async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync()
        if (pushToken !== "") {
          console.log(pushToken)
          const deviceCreation: TCreateDeviceRequest = {
            push_token: pushToken,
            brand: Device.brand || "",
            model: Device.modelName || "",
            os: Device.osName || "",
            os_version: Device.osVersion || "",
          }

          setDevice(deviceCreation)
        }
      } catch (error) {
        console.error(error)
      }

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(response)
        },
      )
    })()

    return () => {
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
}
