import { emailRegex, phoneRegex } from "app/constants/regex"
import { translate } from "app/i18n"
import { getMe } from "app/services/user/callers"
import { loadString, remove, saveString, storageKey } from "app/utils/storage"
import { proxy, subscribe, useSnapshot } from "valtio"

export const authenticationState = proxy({
  accessToken: "",
  refreshToken: "",
  identity: "",
  password: "",
  remember: false,
  isValidated: false,
  id: -1,
  first_name: "",
  last_name: "",
  dob: "",
  username: "",
  email: "",
  phone: "",
  get validateIdentity() {
    if (authenticationState.isValidated) {
      if (authenticationState.identity.length === 0) {
        return translate("validation.required")
      }
      if (
        !emailRegex.test(authenticationState.identity) &&
        !phoneRegex.test(authenticationState.identity)
      ) {
        return translate("validation.isEmailOrPhone")
      }
    }
    return ""
  },
  get validatePassword() {
    if (authenticationState.isValidated) {
      if (authenticationState.password.length === 0) {
        return translate("validation.required")
      }
      if (authenticationState.password.length < 6) {
        return translate("validation.atLeast6Char")
      }
    }
    return ""
  },
})

export const useAuthentication = () => {
  return useSnapshot(authenticationState)
}

subscribe(authenticationState, () => {
  saveString(storageKey.ACCESS_TOKEN, authenticationState.accessToken)
  saveString(storageKey.REFRESH_TOKEN, authenticationState.refreshToken)
  saveString(storageKey.ID, String(authenticationState.id))
  saveString(storageKey.FIRST_NAME, authenticationState.first_name)
  saveString(storageKey.LAST_NAME, authenticationState.last_name)
  saveString(storageKey.DOB, authenticationState.dob)
  saveString(storageKey.USERNAME, authenticationState.username)
  saveString(storageKey.EMAIL, authenticationState.username)
  saveString(storageKey.PHONE, authenticationState.phone)
})

export const getInitialAuthenticationState = async () => {
  const accessToken = await loadString(storageKey.ACCESS_TOKEN)
  if (accessToken) {
    authenticationState.accessToken = accessToken
    const data = await getMe()
    setMeData(data.data)
  }
  const refreshToken = await loadString(storageKey.REFRESH_TOKEN)
  if (refreshToken) {
    authenticationState.refreshToken = refreshToken
  }
  const id = await loadString(storageKey.ID)
  if (id) {
    authenticationState.id = parseInt(id)
  }
  const first_name = await loadString(storageKey.FIRST_NAME)
  if (first_name) {
    authenticationState.first_name = first_name
  }
  const last_name = await loadString(storageKey.LAST_NAME)
  if (last_name) {
    authenticationState.last_name = last_name
  }
  const dob = await loadString(storageKey.DOB)
  if (dob) {
    authenticationState.dob = dob
  }
  const username = await loadString(storageKey.USERNAME)
  if (username) {
    authenticationState.username = username
  }
  const email = await loadString(storageKey.EMAIL)
  if (email) {
    authenticationState.email = email
  }
  const phone = await loadString(storageKey.PHONE)
  if (phone) {
    authenticationState.phone = phone
  }
}

export const setIdentity = (value: string) => {
  authenticationState.identity = value.trim()
}

export const setPassword = (value: string) => {
  authenticationState.password = value.trim()
}

export const setToken = (value: string) => {
  authenticationState.accessToken = value
}

export const setRefreshToken = (value: string) => {
  authenticationState.refreshToken = value
}

export const setMeData = (meData: TMeResponse | undefined) => {
  authenticationState.id = meData?.id || -1
  authenticationState.first_name = meData?.first_name || ""
  authenticationState.last_name = meData?.last_name || ""
  authenticationState.dob = meData?.dob || ""
  authenticationState.username = meData?.username || ""
  authenticationState.email = meData?.email || ""
  authenticationState.phone = meData?.phone || ""
}

export const validateSignIn = () => {
  authenticationState.isValidated = true
  return (
    authenticationState.validateIdentity.length === 0 &&
    authenticationState.validatePassword.length === 0
  )
}

export const resetSignIn = () => {
  authenticationState.identity = ""
  authenticationState.password = ""
  authenticationState.remember = false
  authenticationState.isValidated = false
}

export const logout = () => {
  authenticationState.accessToken = ""
  authenticationState.refreshToken = ""
  authenticationState.identity = ""
  authenticationState.id = -1
  authenticationState.first_name = ""
  authenticationState.last_name = ""
  authenticationState.dob = ""
  authenticationState.username = ""
  authenticationState.email = ""
  authenticationState.phone = ""

  remove(storageKey.ACCESS_TOKEN)
  remove(storageKey.REFRESH_TOKEN)
  remove(storageKey.ID)
  remove(storageKey.FIRST_NAME)
  remove(storageKey.LAST_NAME)
  remove(storageKey.DOB)
  remove(storageKey.USERNAME)
  remove(storageKey.EMAIL)
  remove(storageKey.PHONE)
}
