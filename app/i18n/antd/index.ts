import * as Localization from "expo-localization"

const locales = Localization.getLocales()

export const getAntdLocale = () => {
  const preferredLanguage:
    | Localization.Locale
    | { languageTag: string; textDirection: "ltr" | "rtl" } = locales[0] || {
    languageTag: "en-US",
    textDirection: "ltr",
  }
  const language = preferredLanguage.languageTag
  switch (language) {
    case "vi-VN":
      return require("./vi").default
    default:
      return require("./en").default
  }
}
