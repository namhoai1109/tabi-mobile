import * as Localization from "expo-localization"
import i18n from "i18n-js"
import { I18nManager } from "react-native"

// if English isn't your default language, move Translations to the appropriate language file.
import en, { TTranslations } from "./locale/en"
import vi from "./locale/vi"
import { saveString, storageKey } from "app/utils/storage"
import RNRestart from "react-native-restart"

i18n.fallbacks = true
/**
 * we need always include "*-US" for some valid language codes because when you change the system language,
 * the language code is the suffixed with "-US". i.e. if a device is set to English ("en"),
 * if you change to another language and then return to English language code is now "en-US".
 */
i18n.translations = { en, "en-US": en, vi }

const locales = Localization.getLocales() // This method is guaranteed to return at least one array item.
// The preferred language is the first element in the array, however, we fallback to en-US, especially for tests.
const preferredLanguage:
  | Localization.Locale
  | { languageTag: string; textDirection: "ltr" | "rtl" } = locales[0] || {
  languageTag: "en-US",
  textDirection: "ltr",
}
i18n.locale = preferredLanguage.languageTag

// handle RTL languages
export const isRTL = preferredLanguage.textDirection === "rtl"
I18nManager.allowRTL(isRTL)
I18nManager.forceRTL(isRTL)

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeyPath = RecursiveKeyOf<TTranslations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text

export const getLocale = () => i18n.locale

export const changeLocale = async (lang: string) => {
  if (lang) {
    i18n.locale = lang
    await saveString(storageKey.LANGUAGE, lang)
  }
}
