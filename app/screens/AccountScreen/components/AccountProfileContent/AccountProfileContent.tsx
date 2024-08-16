import * as React from "react"
import { Text } from "app/components/core"
import { StyleSheet, View, Animated, Dimensions, TouchableOpacity } from "react-native"
import Constants from "expo-constants"
import { colors } from "app/theme"
import { styled } from "nativewind"
import { getLocale } from "app/i18n"
import { formatDateStringForCalendarPickerPlaceholder } from "app/utils/formatDate"
import { useAuthentication } from "app/hooks/useAuthentication"

interface ContentProps {}

const { height } = Dimensions.get("window")
const φ = (1 + Math.sqrt(5)) / 2

export const MIN_HEADER_HEIGHT = 64 + Constants.statusBarHeight
export const MAX_HEADER_HEIGHT = height * (1 - 1 / φ)
export const HEADER_DELTA = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

export default ({}: ContentProps) => {
  const { username, dob, email, first_name, last_name, phone } = useAuthentication()
  const locale = getLocale()
  const isEn = locale === "en-US"

  return (
    <Animated.ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1}
      stickyHeaderIndices={[1]}
    >
      <View>
        <StyledView className="w-full flex-col items-center justify-center gap-2">
          <StyledView className="w-[90%] flex-col items-start">
            <StyledText
              className="ml-2 w-full"
              size="xxs"
              ellipsizeMode="tail"
              numberOfLines={1}
              tx="accountScreen.usernameLabel"
            />
            <StyledTouchableOpacity className="w-full flex-row items-center p-1 border-b-2 border-b-neutral-200">
              <StyledText className="w-full" size="xs" ellipsizeMode="tail" numberOfLines={1}>
                {username}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="w-[90%] flex-col items-start">
            <StyledText
              className="ml-2 w-full"
              size="xxs"
              ellipsizeMode="tail"
              numberOfLines={1}
              tx="accountScreen.emailLabel"
            />
            <StyledTouchableOpacity className="w-full flex-row items-center p-1 border-b-2 border-b-neutral-200">
              <StyledText className="w-full" size="xs" ellipsizeMode="tail" numberOfLines={1}>
                {email}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="w-[90%] flex-col items-start">
            <StyledText
              className="ml-2 w-full"
              size="xxs"
              ellipsizeMode="tail"
              numberOfLines={1}
              tx="accountScreen.phoneNumberLabel"
            />
            <StyledTouchableOpacity className="w-full flex-row items-center p-1 border-b-2 border-b-neutral-200">
              <StyledText className="w-full" size="xs" ellipsizeMode="tail" numberOfLines={1}>
                {phone}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="w-[90%] flex-col items-start">
            <StyledText
              className="ml-2 w-full"
              size="xxs"
              ellipsizeMode="tail"
              numberOfLines={1}
              tx="accountScreen.firstNameLabel"
            />
            <StyledTouchableOpacity className="w-full flex-row items-center p-1 border-b-2 border-b-neutral-200">
              <StyledText className="w-full" size="xs" ellipsizeMode="tail" numberOfLines={1}>
                {first_name}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="w-[90%] flex-col items-start">
            <StyledText
              className="ml-2 w-full"
              size="xxs"
              ellipsizeMode="tail"
              numberOfLines={1}
              tx="accountScreen.lastNameLabel"
            />
            <StyledTouchableOpacity className="w-full flex-row items-center p-1 border-b-2 border-b-neutral-200">
              <StyledText className="w-full" size="xs" ellipsizeMode="tail" numberOfLines={1}>
                {last_name}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="w-[90%] flex-col items-start">
            <StyledText
              className="ml-2 w-full"
              size="xxs"
              ellipsizeMode="tail"
              numberOfLines={1}
              tx="accountScreen.dobLabel"
            />
            <StyledTouchableOpacity className="w-full flex-row items-center p-1 border-b-2 border-b-neutral-200">
              <StyledText className="w-full" size="xs" ellipsizeMode="tail" numberOfLines={1}>
                {formatDateStringForCalendarPickerPlaceholder(new Date(dob), isEn)}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </View>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    textAlign: "center",
    color: colors.palette.textLight,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    textAlign: "center",
    color: colors.palette.textLight,
    fontSize: 16,
  },
})
