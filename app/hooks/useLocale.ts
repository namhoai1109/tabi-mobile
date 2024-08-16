import { changeLocale } from "app/i18n"
import { loadString, saveString, storageKey } from "app/utils/storage"
import { proxy, subscribe, useSnapshot } from "valtio"

export const localeState = proxy({
  locale: "en-US",
  isEn: true,
})

export const useLocaleState = () => {
  return useSnapshot(localeState)
}

export const setLocaleState = async (locale: string) => {
  if (locale === "en-US") {
    localeState.locale = locale
    localeState.isEn = true
    await changeLocale("en")
  } else {
    localeState.locale = "vi-VN"
    localeState.isEn = false
    await changeLocale("vi")
  }
}

subscribe(localeState, () => {
  saveString(storageKey.LANGUAGE, localeState.locale)
})

export const getInitialLocaleState = async () => {
  const savedLanguage = await loadString(storageKey.LANGUAGE)
  if (savedLanguage) {
    await changeLocale(savedLanguage)
    setLocaleState(savedLanguage)
  }
}
