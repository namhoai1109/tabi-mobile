import { Icon, Text } from "app/components/core"
import { translate } from "app/i18n"
import moment from "moment"
import { styled } from "nativewind"
import React, { useEffect, useState } from "react"
import { TextInput, TouchableOpacity, View, Alert } from "react-native"

const StyledView = styled(View)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface ITimePickerScreenProps {
  inputTimeRange: number[]
  setInputTimeRange: React.Dispatch<React.SetStateAction<number[]>>
  datePlans: {
    [key: string]: TTimelineItem[]
  }
  setDatePlans: React.Dispatch<
    React.SetStateAction<{
      [key: string]: TTimelineItem[]
    }>
  >
  timelineItems: TTimelineItem[] | undefined
  inputDestination: TDestinationReadOnly | undefined
  selectedDate: string
  onSuccess: () => void
  isEditMode: TDestinationEditMode
  setIsEditMode: React.Dispatch<React.SetStateAction<TDestinationEditMode>>
}

interface OpeningHourRange {
  openTime: number
  closeTime: number
}

function TimePickerScreen({
  inputTimeRange,
  setInputTimeRange,
  datePlans,
  setDatePlans,
  inputDestination,
  selectedDate,
  onSuccess,
  isEditMode,
  setIsEditMode,
}: ITimePickerScreenProps) {
  const [openingHours, setOpeningHours] = useState([{ openTime: 0, closeTime: 23 }])
  const isTimeRangeOverlap = (startTime: Date, endTime: Date, plans: TTimelineItem[]) => {
    if (plans) {
      return plans.some((plan) => {
        const planStart = new Date(plan.startDate)
        const planEnd = new Date(plan.endDate)
        return startTime < planEnd && endTime > planStart
      })
    } else {
      return false
    }
  }

  const extractOpeningHours = (openingHours: string): OpeningHourRange[] => {
    const timeStringToHours = (timeString: string) => {
      const [time, modifier] = timeString.split(" ")
      let [hours] = time.split(":").map(Number)

      if (modifier.toLowerCase() === "pm" && hours !== 12) {
        hours += 12
      } else if (modifier.toLowerCase() === "am" && hours === 12) {
        hours = 0
      }

      return hours
    }

    return openingHours.split(",").map((range) => {
      const [openTime, closeTime] = range
        .split("-")
        .map((time) => time.trim())
        .map(timeStringToHours)
      return { openTime, closeTime }
    })
  }

  const isTimeRangeValid = (timeRange: number[], openingHours: OpeningHourRange[]): boolean => {
    return openingHours.some(
      (range) => timeRange[0] >= range.openTime && timeRange[1] <= range.closeTime,
    )
  }

  useEffect(() => {
    if (inputDestination && inputDestination.opening_hours != "") {
      const openingTimes = extractOpeningHours(inputDestination.opening_hours)
      setOpeningHours(openingTimes)
      inputTimeRange[0] = openingTimes[0]?.openTime || 0
      inputTimeRange[1] = openingTimes[0]?.closeTime || 23
    } else {
      setOpeningHours([{ openTime: 0, closeTime: 23 }])
      setInputTimeRange([0, 0])
    }
  }, [inputDestination])

  return (
    <>
      <StyledView className="w-full flex flex-column items-center justify-start mt-3">
        <StyledView className="w-full flex flex-row items-center justify-between px-4 mt-6">
          <StyledText className="flex flex-row items-center justify-center font-bold" size="md">
            <StyledIcon className="mr-2" icon="userGroup" size={16} />
            {translate("planningScreen.startTime")} (h)
          </StyledText>
          <StyledView className="flex flex-row items-center justify-center">
            <StyledTouchableOpacity
              className="w-10 h-8 flex items-center justify-center bg-neutral-100 rounded-l-lg"
              disabled={inputTimeRange[0] <= 0}
              onPress={() => setInputTimeRange((prev) => [prev[0] - 1, prev[1]])}
            >
              <StyledText className="font-bold text-primary-dominant">-</StyledText>
            </StyledTouchableOpacity>
            <StyledTextInput
              className="w-16 flex items-center justify-center font-bold text-center"
              value={inputTimeRange[0].toString()}
              onChangeText={(e) => {
                const newValue = parseFloat(e)
                if (isNaN(newValue)) {
                  setInputTimeRange((prev) => [openingHours[0]?.openTime, prev[1]])
                } else {
                  let valid = false
                  for (const range of openingHours) {
                    if (newValue >= range.openTime && newValue <= range.closeTime) {
                      valid = true
                      setInputTimeRange((prev) => [newValue, prev[1]])
                      break
                    }
                  }
                  if (!valid) {
                    setInputTimeRange((prev) => [openingHours[0]?.openTime, prev[1]])
                  }
                }
              }}
            />
            <StyledTouchableOpacity
              className="w-10 h-8 flex items-center justify-center bg-neutral-100 rounded-r-lg"
              disabled={inputTimeRange[0] >= 23}
              onPress={() => setInputTimeRange((prev) => [prev[0] + 1, prev[1]])}
            >
              <StyledText className="font-bold text-primary-dominant">+</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* End Time Section */}
        <StyledView className="w-full flex flex-row items-center justify-between px-4 mt-6">
          <StyledText className="flex flex-row items-center justify-center font-bold" size="md">
            <StyledIcon className="mr-2" icon="userGroup" size={16} />
            {translate("planningScreen.endTime")} (h)
          </StyledText>
          <StyledView className="flex flex-row items-center justify-center">
            <StyledTouchableOpacity
              className="w-10 h-8 flex items-center justify-center bg-neutral-100 rounded-l-lg"
              disabled={inputTimeRange[1] <= 0}
              onPress={() => setInputTimeRange((prev) => [prev[0], prev[1] - 1])}
            >
              <StyledText className="font-bold text-primary-dominant">-</StyledText>
            </StyledTouchableOpacity>
            <StyledTextInput
              className="w-16 flex items-center justify-center font-bold text-center"
              value={inputTimeRange[1].toString()}
              onChangeText={(e) => {
                const newValue = parseFloat(e)
                if (isNaN(newValue)) {
                  setInputTimeRange((prev) => [prev[0], openingHours[0]?.closeTime])
                } else {
                  let valid = false
                  for (const range of openingHours) {
                    if (newValue >= range.openTime && newValue <= range.closeTime) {
                      valid = true
                      setInputTimeRange((prev) => [prev[0], newValue])
                      break
                    }
                  }
                  if (!valid) {
                    setInputTimeRange((prev) => [prev[0], openingHours[0]?.closeTime])
                  }
                }
              }}
            />
            <StyledTouchableOpacity
              className="w-10 h-8 flex items-center justify-center bg-neutral-100 rounded-r-lg"
              disabled={inputTimeRange[1] >= 23}
              onPress={() => setInputTimeRange((prev) => [prev[0], prev[1] + 1])}
            >
              <StyledText className="font-bold text-primary-dominant">+</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledView className="w-full h-16 flex flex-row items-center justify-center px-4">
        <StyledTouchableOpacity
          className="w-[95%] h-10 flex flex-col items-center justify-center bg-primary-dominant rounded-lg"
          onPress={() => {
            if (isEditMode.isEdit) {
              setDatePlans((prevDatePlans) => {
                const updatedDatePlans = { ...prevDatePlans }
                let itemIndex = updatedDatePlans[selectedDate].findIndex(
                  (item) =>
                    item.destination === isEditMode.oldDestination &&
                    item.startDate === isEditMode.startDate &&
                    item.endDate === isEditMode.endDate,
                )
                updatedDatePlans[selectedDate].splice(itemIndex, 1)
                return updatedDatePlans
              })
              setIsEditMode({
                isEdit: false,
                oldDestination: {
                  category: "",
                  city: "",
                  duration: "",
                  id: 0,
                  images: [],
                  location: "",
                  name: "",
                  opening_hours: "",
                  rankings: 0,
                  reviews: 0,
                  website: "",
                  lat: "0",
                  lng: "0",
                },
                startDate: new Date(0),
                endDate: new Date(),
              })
            }
            if (inputTimeRange[0] < inputTimeRange[1]) {
              const startTime = moment(selectedDate)
                .startOf("day")
                .add(inputTimeRange[0], "hours")
                .add(1, "second")
                .toDate()
              const endTime = moment(selectedDate)
                .startOf("day")
                .add(inputTimeRange[1], "hours")
                .subtract(1, "second")
                .toDate()

              if (!isTimeRangeValid(inputTimeRange, openingHours)) {
                Alert.alert(
                  translate("planningScreen.invalidTimeRange.label"),
                  translate("planningScreen.invalidTimeRange.message"),
                )
              } else if (isTimeRangeOverlap(startTime, endTime, datePlans[selectedDate])) {
                Alert.alert(
                  translate("planningScreen.timeConflict.label"),
                  translate("planningScreen.timeConflict.message"),
                )
              } else {
                setDatePlans((prevDatePlans) => {
                  const updatedDatePlans = { ...prevDatePlans }
                  updatedDatePlans[selectedDate] = [
                    ...prevDatePlans[selectedDate],
                    {
                      destination: inputDestination,
                      startDate: startTime,
                      endDate: endTime,
                      timeDifference: inputTimeRange[1] - inputTimeRange[0],
                    },
                  ]
                  return updatedDatePlans
                })
                onSuccess()
              }
            } else {
              Alert.alert(
                translate("planningScreen.invalidTimeRange.label"),
                translate("planningScreen.invalidTimeRange.message"),
              )
            }
          }}
        >
          <StyledText className="text-light" tx="planningScreen.confirm" />
        </StyledTouchableOpacity>
      </StyledView>
    </>
  )
}

export default TimePickerScreen
