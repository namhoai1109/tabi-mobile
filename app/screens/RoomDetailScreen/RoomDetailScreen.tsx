import { Button } from "@ant-design/react-native"
import { Icon, Screen, Text } from "app/components/core"
import SliderImage from "app/components/core/SliderImage"
import { TAppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { styled } from "nativewind"
import React, { FC } from "react"
import { Dimensions, ScrollView, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuthentication } from "app/hooks/useAuthentication"
import { isValidInfoForRoomDetailScreen, useReservation } from "app/hooks/useReservation"
import { formatCurrency } from "app/utils/formatCurrency"
import { getLocale, translate } from "app/i18n"
import { getTimeHourAndMinute } from "app/utils/formatDate"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledButton = styled(Button)
const StyledScrollView = styled(ScrollView)
const BOTTOM_SHEET_HEIGHT = 64

interface IRoomDetailScreenProps extends TAppStackScreenProps<"RoomDetail"> {}

const Divider = () => {
  return <StyledView className="h-[1px] bg-gray-100 w-full rounded-full my-3" />
}

const renderFacilities = (facilities: TFacilityModel[], isVN: boolean) => {
  const dist: { [x: string]: string[] } = {}
  facilities?.forEach((facility) => {
    const classFacility = isVN ? facility.class_vi : facility.class_en
    if (!dist[classFacility]) {
      dist[classFacility] = []
    }
    dist[classFacility].push(isVN ? facility.name_vi : facility.name_en)
  })
  return (
    <StyledView className="flex flex-col">
      {Object.keys(dist).map((key) => {
        const facility = dist[key]
        return (
          <StyledView key={key} className="my-2">
            <StyledText preset="semibold">{key}</StyledText>
            <StyledView className="list-disc pl-3">
              {facility?.map((f) => (
                <StyledText key={f}>{f}</StyledText>
              ))}
            </StyledView>
          </StyledView>
        )
      })}
    </StyledView>
  )
}

const RoomDetailScreen: FC<IRoomDetailScreenProps> = function RoomDetailScreen({ navigation }) {
  const { height } = Dimensions.get("screen")
  const sliderHeight = (height * 30) / 100
  const { top, bottom } = useSafeAreaInsets()
  const $backButton: ViewStyle = {
    top,
    left: spacing.s4,
  }

  if (!isValidInfoForRoomDetailScreen()) {
    navigation.goBack()
  }

  const { accessToken } = useAuthentication()
  const isAuthenticated = accessToken !== ""
  const { room, roomImages } = useReservation()
  const locale = getLocale()
  const isEn = locale === "en-US"

  return (
    <Screen preset="fixed">
      <StyledScrollView
        style={{
          height: height - bottom - BOTTOM_SHEET_HEIGHT,
        }}
      >
        <StyledView className="w-10 h-10 absolute z-10" style={$backButton}>
          <StyledButton
            className="rounded-full aspect-square w-9 h-9"
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Icon icon="back" size={16} />
          </StyledButton>
        </StyledView>
        <SliderImage data={roomImages as TFileResponse[]} height={sliderHeight} />
        <StyledView className="p-3">
          <Text preset="heading" text={room?.data.room_name} />
          <StyledView className="flex flex-row items-center justify-start">
            <Text preset="subheading" text={room?.data.room_type.type_name} />
            <Text text={` - ${room?.data.width * room?.data.length} m^2`} />
            <Text text={` - ${room?.data.max_occupancy} ${translate("roomDetailScreen.person")}`} />
          </StyledView>
          <Text
            tx={
              room?.data.room_type.include_breakfast
                ? "roomDetailScreen.includedBreakfast"
                : "roomDetailScreen.notIncludedBreakfast"
            }
          />
          <StyledView className="flex flex-row flex-wrap items-center justify-start">
            <Text
              text={`${translate("roomDetailScreen.checkInTime")}: ${getTimeHourAndMinute(
                room?.data.room_type.check_in_time,
              )}`}
              size="xs"
              style={{
                marginRight: spacing.s4,
              }}
            />
            <Text
              text={`${translate("roomDetailScreen.checkOutTime")}: ${getTimeHourAndMinute(
                room?.data.room_type.check_out_time,
              )}`}
              size="xs"
            />
          </StyledView>

          <Divider />
          <Text preset="bold" tx="roomDetailScreen.bedArrangement" />
          <Text
            text={`${translate("roomDetailScreen.thisRoomHas")} ${
              isEn ? room?.data.bed_type.label_en : room?.data.bed_type.label_vi
            }`}
          />

          <Divider />
          <Text preset="bold" tx="roomDetailScreen.roomFeatureMayLike" />
          {renderFacilities(room?.data.room_type.facilities as TFacilityModel[], !isEn)}
        </StyledView>
      </StyledScrollView>
      <StyledView
        className="w-full border-t-2 border-neutral-100 flex flex-row items-center justify-between px-4"
        style={{
          height: BOTTOM_SHEET_HEIGHT,
        }}
      >
        <StyledView className="flex flex-col">
          <StyledText
            text={`${formatCurrency(room?.data.max_price || 0)} VND`}
            size="xs"
            className="text-neutral-400 w-fit relative line-through"
          />

          <Text
            text={`${formatCurrency(room?.data.current_price || 0)} VND / ${translate(
              "roomDetailScreen.night",
            )}`}
          />
        </StyledView>
        <StyledButton
          type="primary"
          className="w-[125px] h-[44px]"
          onPress={() => {
            if (!isAuthenticated) {
              navigation.navigate("Login")
            } else {
              navigation.navigate("BookingReview")
            }
          }}
        >
          <Text
            tx="roomDetailScreen.reserve"
            style={{
              color: colors.palette.light,
            }}
          />
        </StyledButton>
      </StyledView>
    </Screen>
  )
}

export default RoomDetailScreen
