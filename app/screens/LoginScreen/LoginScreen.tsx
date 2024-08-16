import React, { FC, useState } from "react"
import { Image, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components/core"
import { TAppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { Flex } from "@ant-design/react-native"
// import BlurView from "app/components/core/BlurView"
import SignInForm from "./components/SignInForm"
import SignUpForm from "./components/SignUpForm"
import { styled } from "nativewind"
import { resetSignIn, setMeData } from "app/hooks/useAuthentication"
import { resetSignUp } from "app/hooks/useSignUp"
import { useCreateDevice } from "app/services/notification/services"
import { useSnapshot } from "valtio"
import { deviceState } from "app/hooks/useNotification"
import { getMe } from "app/services/user/callers"

const logo = require("../../../assets/images/logo.png")

const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface ILoginScreenProps extends TAppStackScreenProps<"Login"> {}

const LoginScreen: FC<ILoginScreenProps> = function LoginScreen({ navigation, route }) {
  const isLogin = route.params !== undefined ? route.params.isLogin : true
  const [isSignIn, setIsSignIn] = useState(isLogin)
  const { mutate } = useCreateDevice()
  const snap = useSnapshot(deviceState)

  const createDevice = () => {
    if (snap.push_token !== "") {
      const deviceCreation: TCreateDeviceRequest = {
        push_token: snap.push_token,
        brand: snap.brand,
        model: snap.model,
        os: snap.os,
        os_version: snap.os_version,
      }
      mutate(deviceCreation)
    }
  }

  const onSuccess = async () => {
    const data = await getMe()
    setMeData(data.data)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <StyledView className="p-4 rounded-lg">
        <Flex justify="center" direction="column">
          {isSignIn ? (
            <StyledImage source={logo} className={`object-cover w-[${spacing.LOGO_WIDTH}] mb-10`} />
          ) : (
            <StyledText
              tx="loginScreen.signUp"
              size="xxl"
              preset="bold"
              primary
              className="mb-10 mt-4"
            />
          )}
        </Flex>
        {isSignIn ? (
          <SignInForm
            onSuccess={() => {
              createDevice()
              onSuccess()
              navigation.goBack()
            }}
          />
        ) : (
          <SignUpForm
            onSuccess={() => {
              createDevice()
              onSuccess()
              navigation.navigate("SurveyScreen")
            }}
          />
        )}
        <Flex justify="center">
          <StyledText
            tx={isSignIn ? "loginScreen.noAccount" : "loginScreen.haveAccount"}
            className="text-sm"
          />
          <StyledTouchableOpacity
            className="ml-3"
            onPress={() => {
              if (isSignIn) {
                resetSignUp()
              } else {
                resetSignIn()
              }
              setIsSignIn(!isSignIn)
              resetSignIn()
            }}
          >
            <StyledText
              tx={isSignIn ? "loginScreen.signUp" : "loginScreen.signIn"}
              className="text-primary-dominant-light"
              preset="bold"
            />
          </StyledTouchableOpacity>
        </Flex>
      </StyledView>
    </Screen>
  )
}

export default LoginScreen

const $screenContentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.s6,
  paddingTop: spacing.s6,
  display: "flex",
  justifyContent: "flex-start",
  backgroundColor: colors.background,
}
