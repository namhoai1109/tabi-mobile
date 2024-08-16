// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  dark: "#1F1D2B",
  light: "#FAFAFA",
  grey: "#ABBBC2",
  greyDarker: "#9B9D9E",
  greyLighter: "#E6E7E8",

  baseBgLight: "#FAFAFA",
  baseBgDark: "#1F1D2B",
  baseBgWhite: "#FFFFFC",
  baseBgGrey: "#eeeeee",
  baseBgBlack: "#000D0B",
  baseBgNeutral: "#252836",

  primaryDominant: "#F5566C",
  primaryDominantLight: "#FF7B8F",
  primaryDominantLighter: "#FFF0F0",
  primaryDominantDark: "#D84152",

  primaryAccent: "#5EE2F0",
  primaryAccentLight: "#8FE6F4",
  primaryAccentDark: "#6FE2EF",

  textLight: "#FFFFFC",
  textDark: "#1F1D2B",

  colorError: "#D00000",
  colorSuccess: "#9EE493",
  colorInReview: "#0e7c7b",
  colorCompleted: "#203388",
  shadow: "#B6ACA6",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "transparent",
  /**
   * The default text color in many components.
   */
  text: palette.textDark,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.baseBgWhite,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primaryDominant,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.colorError,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.colorError,

  bgDarkWrapper: "#00000077",
}
