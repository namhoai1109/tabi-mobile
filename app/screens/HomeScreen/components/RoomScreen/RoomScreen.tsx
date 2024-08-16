import React, { FC, useState } from "react"
import { Icon, Text } from "app/components/core"
import { TouchableOpacity, View, Animated, TextInput } from "react-native"
import { colors } from "app/theme/colors"
import { styled } from "nativewind"
import { setRoomTotals, useGetSearchState } from "app/hooks/useSearch"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { TAppStackScreenProps } from "app/navigators/AppNavigator"
import { translate } from "app/i18n"
import { spacing } from "app/theme"

const StyledSafeAreaView = styled(SafeAreaView)
const StyledAnimatedView = styled(Animated.View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledIcon = styled(Icon)
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface IRoomScreenProps extends TAppStackScreenProps<"RoomScreen"> {}

const RoomScreen: FC<IRoomScreenProps> = function RoomScreen({ navigation }) {
  const searchState = useGetSearchState()
  const [roomsField, setRoomsField] = useState(searchState.roomTotals)
  const { top } = useSafeAreaInsets()

  const StickyHeader = () => {
    return (
      <StyledAnimatedView
        style={{
          paddingTop: top + spacing.s4,
        }}
        className="w-full pb-3 px-4 bg-primary-dominant flex flex-row items-center justify-between"
      >
        <StyledTouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full flex items-center justify-start"
        >
          <StyledIcon icon="back" size={20} color={colors.palette.textLight} />
        </StyledTouchableOpacity>
        <StyledView className="flex flex-col items-start justify-start">
          <StyledText size="md" className="font-bold text-light">
            {translate("homeScreen.roomScreen.title")}
          </StyledText>
        </StyledView>
        <View />
      </StyledAnimatedView>
    )
  }

  return (
    <StyledSafeAreaView
      edges={["bottom"]}
      className="w-full h-full flex flex-column items-center justify-between bg-white"
    >
      <StyledView className="w-full flex flex-column items-center justify-start">
        <StickyHeader />
        <StyledView className="w-full flex flex-column items-center justify-start mt-3">
          <StyledView className="w-full flex flex-row items-center justify-between px-4 mt-6">
            <StyledText className="flex flex-row items-center justify-center font-bold" size="md">
              <StyledIcon className="mr-2" icon="doorOpen" size={16} />
              {translate("homeScreen.roomScreen.capacity")}
            </StyledText>
            <StyledView className="flex flex-row items-center justify-center">
              <StyledTouchableOpacity
                className="w-10 h-8 flex items-center justify-center bg-neutral-100 rounded-l-lg"
                disabled={roomsField <= 1}
                onPress={() => setRoomsField(roomsField - 1)}
              >
                <StyledText className="font-bold text-primary-dominant">-</StyledText>
              </StyledTouchableOpacity>
              <StyledTextInput
                className="w-16 flex items-center justify-center font-bold text-center"
                value={roomsField.toString()}
                onChangeText={(e) => {
                  const newValue = parseInt(e)
                  if (isNaN(newValue)) {
                    setRoomsField(1)
                  } else {
                    setRoomsField(newValue)
                  }
                }}
              />
              <StyledTouchableOpacity
                className="w-10 h-8 flex items-center justify-center bg-neutral-100 rounded-r-lg"
                onPress={() => setRoomsField(roomsField + 1)}
              >
                <StyledText className="font-bold text-primary-dominant">+</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledView className="w-full h-16 flex flex-row items-center justify-center px-4">
        <StyledTouchableOpacity
          className="w-[95%] h-10 flex flex-col items-center justify-center bg-primary-dominant rounded-lg"
          onPress={() => {
            setRoomTotals(roomsField)
            navigation.goBack()
          }}
        >
          <StyledText className="text-light">
            {translate("homeScreen.roomScreen.selectButton")}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  )
}

export default RoomScreen
