import { Text } from "app/components/core"
import { translate } from "app/i18n"
import { bookingStatus, getBookingStatusLabel } from "app/services/booking/services"
import { colors, rounded } from "app/theme"
import { formatCurrency } from "app/utils/formatCurrency"
import {
  formatDateStringForCalendarPickerPlaceholder,
  getTimeHourAndMinute,
} from "app/utils/formatDate"
import { styled } from "nativewind"
import React from "react"
import { Image, ImageSourcePropType, Pressable, View, ViewStyle } from "react-native"

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)
const StyledView = styled(View)
const StyledImage = styled(Image)
const whiteCorner = require("../../../../assets/images/corner.png")
const IMAGE_HEIGHT = 132

interface IBookingItemProps {
  data: TBookingModel
  imageSource: ImageSourcePropType
  onPress?: () => void
}

const getTagColor = (status: string) => {
  switch (status) {
    case bookingStatus.Pending:
      return colors.palette.primaryAccent
    case bookingStatus.Approved:
      return colors.palette.colorSuccess
    case bookingStatus.Rejected:
      return colors.palette.primaryDominantDark
    case bookingStatus.Cancel:
      return colors.palette.primaryDominantLight
    case bookingStatus.Completed:
      return colors.palette.colorCompleted
    case bookingStatus.InReview:
      return colors.palette.colorInReview
    default:
      return colors.palette.neutral200
  }
}

const TAG_WIDTH = 100
const TAG_HEIGHT = 28

const BookingTag = ({ status }: { status: string }) => {
  return (
    <StyledView className="absolute z-10 top-2 left-2">
      <StyledView
        className="bg-white pr-2 pb-2 relative"
        style={{
          borderBottomEndRadius: rounded.r3,
        }}
      >
        <StyledView
          className="py-[2px] px-3 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: getTagColor(status),
            width: TAG_WIDTH,
            height: TAG_HEIGHT,
          }}
        >
          <StyledText size="xs" className="text-white" tx={getBookingStatusLabel(status)} />
        </StyledView>
      </StyledView>
    </StyledView>
  )
}

function BookingItem({ data, imageSource, onPress }: IBookingItemProps) {
  const checkInDateItems = formatDateStringForCalendarPickerPlaceholder(
    new Date(data.check_in_date),
    true,
  ).split(",")
  const branch = data.room.branch
  const location = [branch?.ward, branch?.district, branch?.province_city].join(", ")
  return (
    <StyledPressable
      className="flex items-center justify-center pt-2 px-4 mb-3 bg-white"
      onPress={() => {
        if (onPress) {
          onPress()
        }
      }}
    >
      <StyledView className="rounded-xl w-full relative p-2" style={$shadowStyle}>
        <StyledImage
          source={imageSource}
          className="w-full"
          style={{
            height: IMAGE_HEIGHT,
            borderRadius: rounded.r3,
          }}
        />
        <BookingTag status={data.status} />
        <StyledImage
          className="absolute top-2 w-2 h-2"
          source={whiteCorner}
          style={{
            left: TAG_WIDTH + 16,
          }}
        />
        <StyledImage
          className="absolute left-2 w-2 h-2"
          source={whiteCorner}
          style={{
            top: TAG_HEIGHT + 16,
          }}
        />
        <StyledView className="p-2">
          <StyledText preset="subheading" numberOfLines={1}>
            {branch?.branch_name || ""}
          </StyledText>
          <StyledText numberOfLines={1} size="xs">
            {location || ""}
          </StyledText>
          <StyledText numberOfLines={1} size="xs">
            {branch?.address || ""}
          </StyledText>
          <StyledView className="w-full h-[2px] rounded bg-neutral-200 my-3" />
          <StyledView className="flex flex-row justify-center items-start">
            <StyledView className="w-[20%]">
              {checkInDateItems.map((item, index) => {
                if (index === 1) {
                  return (
                    <StyledText key={item} size="md">
                      {item.trim()}
                    </StyledText>
                  )
                }
                return <StyledText key={item}>{item.trim()}</StyledText>
              })}
            </StyledView>
            <StyledView className="w-[2px] h-full rounded bg-neutral-200 mx-3" />
            <StyledView className="grow">
              <StyledText numberOfLines={1} className="max-w-[240px]">
                {data.room.room_name || ""}
              </StyledText>
              <StyledText>{formatCurrency(data.total_price)} VND</StyledText>
              <StyledText>
                {translate("common.checkInAt").toLocaleLowerCase()}{" "}
                {getTimeHourAndMinute(data.room.room_type.check_in_time)}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledPressable>
  )
}

const $shadowStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  elevation: 6,
  shadowColor: colors.palette.neutral800,
}

export default BookingItem
