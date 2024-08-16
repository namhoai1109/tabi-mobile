/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import { useColorScheme } from "react-native"
import Config from "../config"
import { TabiNavigator, TTabiTabParamList } from "./TabiNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import LoginScreen from "app/screens/LoginScreen"
import RoomDetailScreen from "app/screens/RoomDetailScreen"
import BookingReviewScreen from "app/screens/BookingReviewScreen"
import BranchDetailsScreen from "app/screens/BranchDetailsScreen"
import BranchListScreen from "app/screens/BranchListScreen"
import StartDateEndDatePickerScreen from "app/screens/HomeScreen/components/StartDateEndDatePickerScreen"
import RoomScreen from "app/screens/HomeScreen/components/RoomScreen"
import CityPickerScreen from "app/screens/HomeScreen/components/CityPickerScreen"
import BookingDetailScreen from "app/screens/BookingDetailScreen"
import HelpScreen from "app/screens/HelpScreen"
import BookingHistoryScreen from "app/screens/BookingHistoryScreen"
import PlanningScreen from "app/screens/PlanningScreen"
import SurveyScreen from "app/screens/SurveyScreen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TAppStackParamList = {
  Login: LoginParams | undefined
  SurveyScreen: undefined
  Tabi: NavigatorScreenParams<TTabiTabParamList>
  RoomDetail: undefined
  BookingReview: undefined
  PlanScreen: undefined
  BranchList: undefined
  BranchDetails: TBranchResponse
  CityPickerScreen: undefined
  StartDateEndDatePickerScreen: undefined
  RoomScreen: undefined
  BookingDetailScreen: TBookingDetailParams
  HelpScreen: THelpParams
  BookingHistoryScreen: undefined
  PlanningScreen: TPlanningScreenParams
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type TAppStackScreenProps<T extends keyof TAppStackParamList> = NativeStackScreenProps<
  TAppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<TAppStackParamList>()

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={"Tabi"}
    >
      <Stack.Group>
        <Stack.Screen name="Tabi" component={TabiNavigator} />
        <Stack.Screen name="CityPickerScreen" component={CityPickerScreen} />
        <Stack.Screen
          name="StartDateEndDatePickerScreen"
          component={StartDateEndDatePickerScreen}
        />
        <Stack.Screen name="RoomScreen" component={RoomScreen} />
        <Stack.Screen name="BranchList" component={BranchListScreen} />
        <Stack.Screen name="BranchDetails" component={BranchDetailsScreen} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
        <Stack.Screen name="BookingReview" component={BookingReviewScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SurveyScreen" component={SurveyScreen} />
        <Stack.Screen name="BookingDetailScreen" component={BookingDetailScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="BookingHistoryScreen" component={BookingHistoryScreen} />
        <Stack.Screen name="PlanningScreen" component={PlanningScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export interface INavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export function AppNavigator(props: INavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}
