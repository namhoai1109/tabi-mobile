import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Icon } from "../components/core"
import { translate } from "../i18n"
import { colors, spacing, typography, text } from "../theme"
import { TAppStackParamList, TAppStackScreenProps } from "./AppNavigator"
import HomeScreen from "app/screens/HomeScreen"
import BookingScreen from "app/screens/BookingScreen"
import AccountScreen from "app/screens/AccountScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { animTabBar, useHideTabBar } from "app/hooks/useHideTabBar"
import AnimatedLottieView from "lottie-react-native"
import { useQueryClient } from "react-query"
import { keyBranch } from "app/services/branch/services"
import { useAuthentication } from "app/hooks/useAuthentication"
import { keyBooking } from "app/services/booking/services"
// import { useLocaleState } from "app/hooks/useLocale"

export type TTabiTabParamList = {
  Home: undefined
  Booking: undefined
  Account: undefined
  // ex: DemoShowroom: { queryIndex?: string; itemIndex?: string }
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types /Users/namhoai/Library/Android/sdk
 */
export type TTabiTabScreenProps<T extends keyof TTabiTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TTabiTabParamList, T>,
  TAppStackScreenProps<keyof TAppStackParamList>
>

const Tab = createBottomTabNavigator<TTabiTabParamList>()

const lottiesHome = require("../../assets/lotties/home.json")
const lottiesBooking = require("../../assets/lotties/calendar.json")
const lottiesUser = require("../../assets/lotties/user.json")

export function TabiNavigator() {
  const { bottom } = useSafeAreaInsets()
  const snap = useHideTabBar()
  const $tabBars: ViewStyle = {
    bottom,
    ...$tabBar,
    transform: [{ translateY: animTabBar(snap.isHidden) }],
  }
  const lottieRefs = React.useRef<AnimatedLottieView[]>([])
  const queryClient = useQueryClient()
  const { id: userID, accessToken } = useAuthentication()
  const isAuthenticated = accessToken !== ""

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: $tabBars,
        tabBarActiveTintColor: colors.palette.primaryDominant,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={{
          tabPress: () => {
            queryClient.invalidateQueries([keyBranch.BRANCH_RECOMMENDED, userID])
            queryClient.invalidateQueries(keyBranch.BRANCH_FEATURED)
          },
        }}
        options={{
          tabBarLabel: translate("navigator.homeTab"),
          tabBarIcon: ({ focused }) => {
            if (focused) {
              lottieRefs.current[0]?.play()
              return (
                <AnimatedLottieView
                  source={lottiesHome}
                  style={$lottieStyle}
                  ref={(el) => (lottieRefs.current[0] = el as AnimatedLottieView)}
                  loop={false}
                />
              )
            }
            return <Icon icon="home" size={tabBarIconSize} />
          },
        }}
      />

      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        listeners={{
          tabPress: () => {
            if (isAuthenticated) queryClient.invalidateQueries(keyBooking.BOOKING_LIST)
          },
        }}
        options={{
          tabBarLabel: translate("navigator.bookingTab"),
          // tabBarLabel: isEn ? "Booking" : "Đặt chỗ",
          tabBarIcon: ({ focused }) => {
            if (focused) {
              lottieRefs.current[1]?.play()
              return (
                <AnimatedLottieView
                  source={lottiesBooking}
                  style={$lottieStyle}
                  ref={(el) => (lottieRefs.current[1] = el as AnimatedLottieView)}
                  loop={false}
                />
              )
            }
            return <Icon icon="calendar" size={tabBarIconSize} />
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: translate("navigator.accountTab"),
          // tabBarLabel: isEn ? "Account" : "Tài khoản",
          tabBarIcon: ({ focused }) => {
            if (focused) {
              lottieRefs.current[2]?.play()
              return (
                <AnimatedLottieView
                  source={lottiesUser}
                  style={$lottieStyle}
                  ref={(el) => (lottieRefs.current[2] = el as AnimatedLottieView)}
                  loop={false}
                />
              )
            }
            return <Icon icon="user" size={tabBarIconSize} />
          },
        }}
      />
    </Tab.Navigator>
  )
}

const tabBarIconSize = 28

const $lottieStyle: ViewStyle = {
  width: tabBarIconSize,
  height: tabBarIconSize,
}

const $tabBar: ViewStyle = {
  position: "absolute",
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
  height: spacing.s16,
}

const $tabBarItem: ViewStyle = {
  transform: [{ translateY: spacing.s4 }],
}

const $tabBarLabel: TextStyle = {
  ...text.xxxs,
  fontFamily: typography.primary.medium,
}
