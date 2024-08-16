import { Header, Icon, Screen, Text } from "app/components/core"
import { TTabiTabScreenProps } from "app/navigators/TabiNavigator"
import { colors, spacing } from "app/theme"

import { styled } from "nativewind"
import React, { FC } from "react"
import { Pressable, ScrollView, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import BookingList from "./components/BookingList"
import { useAuthentication } from "app/hooks/useAuthentication"
import { useQueryClient } from "react-query"
import { keyBooking } from "app/services/booking/services"

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)
const StyledView = styled(View)
const StyledScreen = styled(Screen)
const StyledScrollView = styled(ScrollView)

const BookingScreen: FC<TTabiTabScreenProps<"Booking">> = function BookingScreen({ navigation }) {
  const { top } = useSafeAreaInsets()
  const { accessToken } = useAuthentication()
  const queryClient = useQueryClient()
  const isAuthenticated = accessToken !== ""

  return (
    <StyledScreen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      style={{
        marginBottom: spacing.s15 + spacing.s11 + top,
      }}
    >
      <Header
        titleTx="bookingScreen.title"
        titleMode="center"
        containerStyle={$header}
        style={{
          height: spacing.s11,
        }}
        rightIcon={isAuthenticated ? "history" : undefined}
        onRightPress={() => {
          queryClient.invalidateQueries(keyBooking.BOOKING_HISTORY_LIST)
          navigation.navigate("BookingHistoryScreen")
        }}
      />
      <StyledScrollView className="w-full h-full">
        {isAuthenticated ? (
          <BookingList navigation={navigation} />
        ) : (
          <StyledView className="w-full flex justify-center items-center mt-5">
            <Icon icon="emptyFolder" size={spacing.s18} />
            <StyledText
              size="xs"
              className="text-center w-2/3"
              tx="bookingScreen.authorizationGuide"
            />
            <StyledView className="mt-5 flex flex-row justify-center items-center">
              <StyledPressable
                className="border border-neutral-300 rounded-lg w-[120px] h-[32px] flex items-center justify-center mr-4"
                onPress={() => {
                  navigation.navigate("Login", {
                    isLogin: true,
                  })
                }}
              >
                <StyledText tx="bookingScreen.login" />
              </StyledPressable>
              <StyledPressable
                className="border border-primary-dominant bg-primary-dominant rounded-lg w-[120px] h-[32px] flex items-center justify-center"
                onPress={() => {
                  navigation.navigate("Login", {
                    isLogin: false,
                  })
                }}
              >
                <StyledText className="text-white" tx="bookingScreen.register" />
              </StyledPressable>
            </StyledView>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledScreen>
  )
}

const $header: ViewStyle = {
  borderBottomWidth: 2,
  borderBottomColor: colors.palette.neutral200,
}

export default BookingScreen
