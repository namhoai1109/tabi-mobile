import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import ErrorBoundary from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { colors, customFontsToLoad } from "./theme"
import Config from "./config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { UIManager, ViewStyle } from "react-native"
import { config } from "./navigators/configNavigator"
import { Provider } from "@ant-design/react-native"
import * as Font from "expo-font"
import { getAntdLocale } from "./i18n/antd"
import { QueryClient, QueryClientProvider } from "react-query"
import { getInitialAuthenticationState } from "./hooks/useAuthentication"
import { useNotification } from "./hooks/useNotification"
import { getInitialLocaleState } from "./hooks/useLocale"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")

const antdTheme = {
  color_text_base: colors.text,
  primary_button_fill: colors.palette.primaryDominant,
  primary_button_fill_tap: colors.palette.primaryDominantLight,
  checkbox_fill: colors.palette.primaryDominant,
  switch_fill: colors.palette.primaryDominant,
  input_color_icon: colors.palette.primaryDominant,
  input_color_icon_tap: colors.palette.primaryDominantLight,
  fill_base: colors.background,
  fill_tap: colors.palette.neutral200,
  segmented_control_color: colors.palette.primaryDominant,
  brand_primary: colors.palette.primaryDominant,
  brand_primary_tap: colors.palette.primaryDominantLight,
  brand_success: colors.palette.colorSuccess,
  brand_error: colors.palette.colorError,
  toast_fill: colors.palette.primaryDominantLight,
}

interface IAppProps {
  hideSplashScreen: () => Promise<boolean>
}

const queryClient = new QueryClient()

/**
 * This is the root component of our app.
 */
function App(props: IAppProps) {
  const { hideSplashScreen } = props
  const { initialNavigationState, isRestored: isNavigationStateRestored } =
    useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  // load initial authentication state
  getInitialAuthenticationState()
  getInitialLocaleState()

  // notification
  useNotification()

  // load antd icons
  Font.loadAsync("antoutline", require("@ant-design/icons-react-native/fonts/antoutline.ttf"))
  Font.loadAsync("antfill", require("@ant-design/icons-react-native/fonts/antfill.ttf"))

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  setTimeout(hideSplashScreen, 500)

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored || !areFontsLoaded) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <QueryClientProvider client={queryClient}>
        <Provider theme={antdTheme} locale={getAntdLocale()}>
          <ErrorBoundary catchErrors={Config.catchErrors}>
            <GestureHandlerRootView style={$container}>
              <AppNavigator linking={linking} initialState={initialNavigationState} />
            </GestureHandlerRootView>
          </ErrorBoundary>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
