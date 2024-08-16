import { Header, Icon, Text } from "app/components/core"
import { getLocale } from "app/i18n"
import { colors, spacing } from "app/theme"
import {
  formatDateStringForCalendarPickerPlaceholder,
  getDatesBetween2Dates,
} from "app/utils/formatDate"
import { styled } from "nativewind"
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react"
import { Animated, FlatList, Pressable, View, ViewStyle } from "react-native"

const StyledView = styled(View)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)
const StyledFlatlist = styled(FlatList<{ dateDisplay: string; date: string }>)
const StyledPressable = styled(Pressable)
const StyledAnimatedView = styled(Animated.View)

interface IDateProps {
  item: string
  isActive: boolean
  onPress: () => void
}

interface IPlanningHeaderProps {
  onBack: () => void
  onSave: () => void
  onMapView: () => void
  checkInDate: string
  checkOutDate: string
  selectedDate: string
  setSelectedDate: Dispatch<SetStateAction<string>>
  onDateChange: (date: string) => void
}

const Date = ({ item, isActive, onPress }: IDateProps) => {
  const animated = useMemo(() => new Animated.Value(0), [])
  const dimensions = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  })

  useEffect(() => {
    Animated.timing(animated, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [isActive])

  return (
    <StyledView
      style={{
        backgroundColor: isActive
          ? colors.palette.primaryDominantLighter
          : colors.palette.neutral100,
      }}
      className="w-10 h-[70px] mx-1 rounded-lg"
    >
      <StyledPressable className="w-full h-full flex items-center justify-center" onPress={onPress}>
        <StyledText size="xxs" className="text-neutral-400">
          {item.split(" ")[0]}
        </StyledText>
        <StyledText>{item.split(" ")[1]}</StyledText>
        {isActive && (
          <StyledAnimatedView
            className="rounded-full bg-primary-dominant mt-[2px]"
            style={{
              width: dimensions,
              height: dimensions,
            }}
          />
        )}
      </StyledPressable>
    </StyledView>
  )
}

const PlanningHeader = ({
  onBack,
  onSave,
  checkInDate,
  checkOutDate,
  selectedDate,
  setSelectedDate,
  onDateChange,
  onMapView,
}: IPlanningHeaderProps) => {
  const isEN = getLocale() === "en-US"
  const dateList = getDatesBetween2Dates(checkInDate, checkOutDate).map((date) => {
    return {
      dateDisplay: formatDateStringForCalendarPickerPlaceholder(date, isEN).split(",")[1].trim(),
      date: date.toISOString(),
    }
  })

  return (
    <StyledView
      className="rounded-b-xl z-10"
      style={{
        backgroundColor: colors.palette.neutral100,
        elevation: 6,
        shadowColor: colors.palette.neutral800,
      }}
    >
      <StyledView className="w-[90%] flex flex-row items-center pt-2">
        <Header
          leftIcon="back"
          onLeftPress={onBack}
          titleTx="planningScreen.headerTitle"
          titleMode="center"
          style={{
            height: spacing.s8,
          }}
          rightIcon="map"
          onRightPress={onMapView}
        />
        <StyledIcon
          icon="check"
          size={20}
          containerStyle={[$actionIconContainer, { backgroundColor: colors.background }]}
          onPress={onSave}
        />
      </StyledView>
      <StyledFlatlist
        className="mt-2 pb-2"
        data={dateList}
        horizontal
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.s2,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Date
            item={item.dateDisplay}
            isActive={item.date === selectedDate}
            onPress={() => {
              setSelectedDate(item.date)
              onDateChange(item.date)
            }}
          />
        )}
      />
    </StyledView>
  )
}

const $actionIconContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  paddingTop: spacing.s7,
  paddingHorizontal: spacing.s3,
  zIndex: 2,
}

export default PlanningHeader
