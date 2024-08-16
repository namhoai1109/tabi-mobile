import React, { FC, useState } from "react"
import { Icon, Text } from "app/components/core"
import { TouchableOpacity, View, Animated } from "react-native"
import CalendarPicker from "react-native-calendar-picker"
import { colors } from "app/theme/colors"
import { styled } from "nativewind"
import { useGetSearchState, setStartDate, setEndDate } from "app/hooks/useSearch"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { TAppStackScreenProps } from "app/navigators/AppNavigator"
import { getLocale, translate } from "app/i18n"
import { formatDateStringForCalendarPickerPlaceholder } from "app/utils/formatDate"
import { spacing } from "app/theme"

const StyledSafeAreaView = styled(SafeAreaView)
const StyledAnimatedView = styled(Animated.View)
const StyledText = styled(Text)
const StyledCalendarPicker = styled(CalendarPicker)
const StyledIcon = styled(Icon)
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface IStartDateEndDatePickerScreenProps
  extends TAppStackScreenProps<"StartDateEndDatePickerScreen"> {}

const StartDateEndDatePickerScreen: FC<IStartDateEndDatePickerScreenProps> =
  function StartDateEndDatePickerScreen({ navigation }) {
    const searchState = useGetSearchState()
    const [startDateField, setStartDateField] = useState(searchState.startDate)
    const [endDateField, setEndDateField] = useState(searchState.endDate)
    const [startDateUnformatted, setStartDateUnformatted] = useState(searchState.startDate)
    const [endDateUnformatted, setEndDateUnformatted] = useState(searchState.endDate)
    const locale = getLocale()
    const isEn = locale === "en-US"
    const { top } = useSafeAreaInsets()

    const minDate = new Date()

    const onDateChange = (date: Date, type: string) => {
      if (type === "END_DATE") {
        setEndDateUnformatted(date)
        setEndDateField(date)
      } else {
        setStartDateUnformatted(date)
        setStartDateField(date)
      }
    }

    const StickyHeader = () => {
      return (
        <StyledAnimatedView
          style={{
            paddingTop: top + spacing.s4,
          }}
          className="pb-3 px-4 mb-2 bg-primary-dominant flex flex-row items-center justify-between"
        >
          <StyledTouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full flex items-center justify-start"
          >
            <StyledIcon icon="back" size={20} color={colors.palette.textLight} />
          </StyledTouchableOpacity>
          <StyledView className="flex flex-col items-start justify-start">
            <StyledText size="md" className="font-bold text-light">
              {translate("homeScreen.startDateEndDatePickerScreen.title")}
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
        <StyledView>
          <StickyHeader />
          <StyledCalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            todayBackgroundColor={colors.palette.neutral300}
            selectedDayColor={colors.palette.primaryDominant}
            selectedDayTextColor={colors.palette.textLight}
            minDate={minDate}
            weekdays={[
              translate("homeScreen.startDateEndDatePickerScreen.days.mon"),
              translate("homeScreen.startDateEndDatePickerScreen.days.tue"),
              translate("homeScreen.startDateEndDatePickerScreen.days.wed"),
              translate("homeScreen.startDateEndDatePickerScreen.days.thu"),
              translate("homeScreen.startDateEndDatePickerScreen.days.fri"),
              translate("homeScreen.startDateEndDatePickerScreen.days.sat"),
              translate("homeScreen.startDateEndDatePickerScreen.days.sun"),
            ]}
            months={[
              translate("homeScreen.startDateEndDatePickerScreen.months.jan"),
              translate("homeScreen.startDateEndDatePickerScreen.months.feb"),
              translate("homeScreen.startDateEndDatePickerScreen.months.mar"),
              translate("homeScreen.startDateEndDatePickerScreen.months.apr"),
              translate("homeScreen.startDateEndDatePickerScreen.months.may"),
              translate("homeScreen.startDateEndDatePickerScreen.months.jun"),
              translate("homeScreen.startDateEndDatePickerScreen.months.jul"),
              translate("homeScreen.startDateEndDatePickerScreen.months.aug"),
              translate("homeScreen.startDateEndDatePickerScreen.months.sep"),
              translate("homeScreen.startDateEndDatePickerScreen.months.oct"),
              translate("homeScreen.startDateEndDatePickerScreen.months.nov"),
              translate("homeScreen.startDateEndDatePickerScreen.months.dec"),
            ]}
            previousTitle={translate("homeScreen.startDateEndDatePickerScreen.previousButton")}
            nextTitle={translate("homeScreen.startDateEndDatePickerScreen.nextButton")}
            onDateChange={onDateChange}
          />
        </StyledView>
        <StyledView className="w-full h-16 flex flex-row items-center justify-between px-4 border-t-2 border-neutral-100">
          <StyledView className="flex flex-col items-start justify-start w-[120px]">
            <StyledText className="text-sm font-bold">
              {translate("homeScreen.startDateEndDatePickerScreen.startDate")}
            </StyledText>
            <StyledText className="text-xs text-neutral-500 font-semibold">
              {formatDateStringForCalendarPickerPlaceholder(startDateField, isEn)}
            </StyledText>
          </StyledView>
          <StyledView className="flex flex-col items-start justify-start w-[120px]">
            <StyledText className="text-sm font-bold">
              {translate("homeScreen.startDateEndDatePickerScreen.endDate")}
            </StyledText>
            <StyledText className="text-xs text-neutral-500 font-semibold">
              {formatDateStringForCalendarPickerPlaceholder(endDateField, isEn)}
            </StyledText>
          </StyledView>
          <StyledTouchableOpacity
            className="w-24 h-10 flex flex-col items-center justify-center bg-primary-dominant rounded-lg"
            onPress={() => {
              setStartDate(startDateUnformatted)
              setEndDate(endDateUnformatted)
              setStartDate(startDateField)
              setEndDate(endDateField)
              navigation.goBack()
            }}
          >
            <StyledText className="text-light">
              {translate("homeScreen.startDateEndDatePickerScreen.continueButton")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledSafeAreaView>
    )
  }

export default StartDateEndDatePickerScreen
