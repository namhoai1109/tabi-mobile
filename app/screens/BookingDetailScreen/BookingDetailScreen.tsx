import { Button } from "@ant-design/react-native"
import { Icon, Screen, Text } from "app/components/core"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import { getLocale, translate } from "app/i18n"
import { TAppStackScreenProps } from "app/navigators"
import { bookingStatus, getBookingStatusLabel, keyBooking } from "app/services/booking/services"
import { getCancellationTimeUnitLabel } from "app/services/branch/services"
import { colors, spacing } from "app/theme"
import { formatCurrency } from "app/utils/formatCurrency"
import {
  formatDateStringForCalendarPickerPlaceholder,
  getTimeHourAndMinute,
} from "app/utils/formatDate"
import { LinearGradient } from "expo-linear-gradient"
import AnimatedLottieView from "lottie-react-native"
import { styled } from "nativewind"
import React, { useRef, useEffect, useState } from "react"
import { Dimensions, Image, Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import SendingReviewBS from "./components/SendingReviewBS"
import { useQueryClient } from "react-query"
import provincesAndCities from "app/constants/provincesAndCities"
import { useDeleteAllPlans, useGetPlanDetailsById } from "app/services/plan/services"

const StyledImage = styled(Image)
const StyledButton = styled(Button)
const StyledView = styled(View)
const StyledText = styled(Text)
const StyledPressable = styled(Pressable)
const StyledScreen = styled(Screen)
const StyledIcon = styled(Icon)
const StyledLinearGradient = styled(LinearGradient)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)
const lottiesGlobe = require("../../../assets/lotties/stars.json")

interface TBookingDetailScreenProps extends TAppStackScreenProps<"BookingDetailScreen"> {}
function BookingDetailScreen({ navigation, route }: TBookingDetailScreenProps) {
  const bookingData = route.params.data
  if (
    bookingData === undefined ||
    bookingData === null ||
    bookingData.file === undefined ||
    bookingData.file === null ||
    bookingData.data === undefined ||
    bookingData.data === null
  ) {
    navigation.goBack()
    return null
  }

  const { data: dataPlanDetails, refetch: refetchPlanDetails } = useGetPlanDetailsById(
    bookingData.data.id,
  )
  const { mutate: mutateDeleteAllPlans } = useDeleteAllPlans(() => refetchPlanDetails())
  const { height } = Dimensions.get("screen")
  const heightImage = (height * 34) / 100
  const { top } = useSafeAreaInsets()
  const isEN = getLocale() === "en-US"
  const queryClient = useQueryClient()

  const [ids, setIds] = useState<any>([])

  const checkInDateItems = formatDateStringForCalendarPickerPlaceholder(
    new Date(bookingData.data.check_in_date),
    true,
  ).split(",")

  const checkOutDateItems = formatDateStringForCalendarPickerPlaceholder(
    new Date(bookingData.data.check_out_date),
    true,
  ).split(",")

  const branch = bookingData.data.room.branch
  const branchDetailParams = {
    data: {
      id: branch?.id,
      name: branch?.branch_name,
      district: branch?.district,
      province_city: branch?.province_city,
      min_price: branch?.min_price,
      max_price: branch?.max_price,
    },
    file: bookingData.file,
  } as TBranchResponse

  const statusLabel = translate(getBookingStatusLabel(bookingData.data.status)).toLocaleLowerCase()
  const canPlanning = bookingData.data.status === bookingStatus.Approved
  const continuePlanning =
    bookingData.data.status === bookingStatus.Approved &&
    dataPlanDetails?.data.data &&
    dataPlanDetails.data.data.length > 0
  const canReview = bookingData.data.status === bookingStatus.InReview
  const bottomSheetRef = useRef<TBottomSheet>(null)
  const bsRef = useRef<TBottomSheet>(null)

  useEffect(() => {
    const tempIds: number[] = []
    if (dataPlanDetails?.data.data) {
      dataPlanDetails.data.data.forEach((planDetail) => {
        tempIds.push(planDetail.id)
      })
    }
    setIds(tempIds)
  }, [dataPlanDetails?.data.data])
  return (
    <StyledScreen preset="scroll" safeAreaEdges={["bottom"]} className="bg-neutral-100">
      <StyledView
        className="absolute z-10"
        style={{
          top: top + spacing.s2,
          left: spacing.s4,
          right: spacing.s4,
        }}
      >
        <StyledButton
          className="rounded-full aspect-square w-9 h-9"
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon icon="back" size={16} />
        </StyledButton>

        <StyledText preset="subheading" className="text-white mt-2" numberOfLines={2}>
          {translate("bookingDetailsScreen.yourReservationIs")} {statusLabel}
        </StyledText>
        {bookingData.data.status === bookingStatus.Rejected && (
          <StyledText className="text-white" numberOfLines={4}>
            {bookingData.data.reason}
          </StyledText>
        )}
      </StyledView>

      <StyledView
        className="w-full relative"
        style={{
          height: heightImage,
        }}
      >
        <StyledImage source={{ uri: bookingData.file.get_url }} className="w-full h-full" />
        <StyledView className="absolute w-full h-full bg-black opacity-30" />
      </StyledView>

      <StyledView className="p-3 ">
        {canPlanning && (
          <StyledLinearGradient
            className="rounded-lg p-[2px] mb-3"
            colors={[colors.palette.primaryDominant, colors.palette.primaryAccent]}
            start={{ x: 0.1, y: 0.2 }}
          >
            <StyledPressable
              className="bg-white flex flex-row justify-center items-center rounded-md py-[2px]"
              onPress={() => {
                navigation.navigate("PlanningScreen", {
                  checkInDate: bookingData.data.check_in_date,
                  checkOutDate: bookingData.data.check_out_date,
                  user_id: bookingData.data.user_id,
                  city:
                    provincesAndCities.find((item) => item.label === branch?.province_city)?.name ||
                    "",
                  booking_id: bookingData.data.id,
                  booking: bookingData,
                  // dataPlanDetails: dataPlanDetails,
                  ids: ids,
                })
              }}
            >
              <StyledText
                size="md"
                preset="semibold"
                className="mr-2 text-primary-accent"
                tx={
                  continuePlanning
                    ? "bookingDetailsScreen.continuePlanLabel"
                    : "bookingDetailsScreen.planLabel"
                }
              />
              <AnimatedLottieView
                source={lottiesGlobe}
                style={{
                  width: spacing.s9,
                  height: spacing.s9,
                }}
                loop
                autoPlay
                speed={0.3}
              />
            </StyledPressable>
          </StyledLinearGradient>
        )}
        {canReview && (
          <StyledPressable
            className="bg-white flex flex-row justify-center items-center rounded-md py-1 mb-3 border-2 border-primary-dominant-light"
            onPress={() => {
              bottomSheetRef.current?.open()
            }}
          >
            <StyledText
              size="md"
              preset="semibold"
              className="mr-2 text-primary-dominant-light"
              tx="bookingDetailsScreen.reviewLabel"
            />
          </StyledPressable>
        )}

        {continuePlanning && (
          <StyledLinearGradient
            className="rounded-lg p-[2px] mb-3"
            colors={[colors.palette.colorError, colors.palette.colorError]}
            start={{ x: 0.1, y: 0.2 }}
          >
            <StyledPressable
              className="bg-white flex flex-row justify-center items-center rounded-md py-[2px]"
              onPress={async () => {
                mutateDeleteAllPlans(ids)
              }}
            >
              <StyledText
                size="md"
                preset="semibold"
                className="mr-2 text-color-error"
                tx="bookingDetailsScreen.deletePlanLabel"
              />
            </StyledPressable>
          </StyledLinearGradient>
        )}

        <StyledView className="flex flex-row justify-center items-center bg-white p-3 rounded-lg">
          <StyledView className="grow">
            <StyledText>
              {translate("common.checkInAt")}{" "}
              {getTimeHourAndMinute(bookingData.data.room.room_type.check_in_time)}
            </StyledText>
            <StyledText preset="bold">
              {checkInDateItems[0].trim()}, {checkInDateItems[1].trim()}
            </StyledText>
            <StyledText>{checkInDateItems[2].trim()}</StyledText>
          </StyledView>
          <StyledView className="w-[2px] h-full bg-neutral-200 rounded mx-4" />
          <StyledView className="grow">
            <StyledText>
              {translate("common.checkOutAt")}{" "}
              {getTimeHourAndMinute(bookingData.data.room.room_type.check_out_time)}
            </StyledText>
            <StyledText preset="bold">
              {checkOutDateItems[0].trim()}, {checkOutDateItems[1].trim()}
            </StyledText>
            <StyledText>{checkOutDateItems[2].trim()}</StyledText>
          </StyledView>
        </StyledView>

        <StyledText preset="subheading" className="mt-3 ml-3" tx="bookingDetailsScreen.branch" />
        <StyledPressable
          className="bg-white p-3 rounded-lg relative"
          onPress={() => {
            navigation.navigate("BranchDetails", branchDetailParams)
          }}
        >
          <StyledView className="absolute right-0 top-1/2 pr-[3px]">
            <StyledIcon icon="caretRight" />
          </StyledView>
          <StyledView className="mr-6">
            <StyledText preset="semibold" numberOfLines={1}>
              {branch?.branch_name}
            </StyledText>
            <StyledText size="xs" numberOfLines={1}>
              {branch?.ward}, {branch?.district}, {branch?.province_city}
            </StyledText>
            <StyledText size="xs" numberOfLines={1}>
              {branch?.address}
            </StyledText>
          </StyledView>
        </StyledPressable>

        <StyledText preset="subheading" className="mt-3 ml-3" tx="bookingDetailsScreen.Details" />
        <StyledView className="bg-white p-3 rounded-lg">
          <StyledView className="flex flex-row">
            <StyledText
              size="xs"
              preset="semibold"
              numberOfLines={1}
              className="w-1/3"
              tx="bookingDetailsScreen.room"
            />
            <StyledText size="xs" numberOfLines={1} className="w-2/3">
              {bookingData.data.room.room_name}
            </StyledText>
          </StyledView>

          <StyledView className="flex flex-row">
            <StyledText
              size="xs"
              preset="semibold"
              numberOfLines={1}
              className="w-1/3"
              tx="bookingDetailsScreen.quantity"
            />
            <StyledText size="xs" numberOfLines={1} className="w-2/3">
              {bookingData.data.quantity}
            </StyledText>
          </StyledView>

          <StyledView className="flex flex-row">
            <StyledText
              size="xs"
              preset="semibold"
              numberOfLines={1}
              className="w-1/3"
              tx="bookingDetailsScreen.totalPrice"
            />
            <StyledText size="xs" numberOfLines={1} className="w-2/3">
              {formatCurrency(bookingData.data.total_price)} VND
            </StyledText>
          </StyledView>

          <StyledView className="flex flex-row">
            <StyledText
              size="xs"
              preset="semibold"
              numberOfLines={1}
              className="w-1/3"
              tx="bookingDetailsScreen.payment"
            />
            <StyledText size="xs" numberOfLines={1} className="w-2/3">
              {bookingData.data.payment_method}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText preset="subheading" className="mt-3 ml-3" tx="bookingDetailsScreen.policy" />
        <StyledView className="bg-white p-3 rounded-lg">
          <StyledText
            preset="semibold"
            numberOfLines={1}
            tx="bookingDetailsScreen.cancellationPolicy"
          />
          <StyledText size="xs">
            {translate("bookingDetailsScreen.canCancel")} {branch?.cancellation_time_value}{" "}
            {translate(
              getCancellationTimeUnitLabel(branch?.cancellation_time_unit as string),
            ).toLocaleLowerCase()}
            {isEN && "(s)"} {translate("bookingDetailsScreen.beforeCheckIn")}.
          </StyledText>

          <StyledText
            preset="semibold"
            numberOfLines={1}
            className="mt-3"
            tx="bookingDetailsScreen.generalPolicy"
          />
          <StyledText className="text-sm" ellipsizeMode="tail" numberOfLines={8}>
            {branch?.general_policy}
          </StyledText>
          <StyledView className="w-full flex items-center justify-center">
            <StyledTouchableOpacity
              className="mt-2"
              onPress={() => {
                bsRef.current?.open()
              }}
            >
              <StyledText className="text-md text-primary-dominant font-bold">Read all</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledPressable
          className="bg-white p-3 rounded-lg mt-3 flex flex-row justify-between items-center"
          onPress={() => {
            navigation.navigate("HelpScreen", {
              bookingID: bookingData.data.id,
              status: bookingData.data.status,
              paymentMethod: bookingData.data.payment_method,
            })
          }}
        >
          <StyledText preset="semibold" tx="bookingDetailsScreen.help" />
          <StyledIcon icon="caretRight" />
        </StyledPressable>
      </StyledView>

      <SendingReviewBS
        bottomSheetRef={bottomSheetRef}
        roomId={bookingData.data.room.id}
        bookingId={bookingData.data.id}
        branchId={branch?.id as number}
        onSuccess={() => {
          navigation.goBack()
          queryClient.invalidateQueries(keyBooking.BOOKING_LIST)
        }}
      />

      <BottomSheet
        height={600}
        ref={bsRef}
        customStyles={{
          container: {
            borderTopLeftRadius: spacing.s6,
            borderTopRightRadius: spacing.s6,
          },
        }}
      >
        <StyledView>
          <StyledView className="flex flex-row items-center justify-start py-2 px-6 border-b border-neutral-300">
            <StyledText preset="subheading" tx="branchDetailsScreen.policy.generalPolicy" />
          </StyledView>
          <StyledScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: 552,
              paddingLeft: spacing.s4,
              paddingRight: spacing.s4,
            }}
          >
            <StyledText>{branch?.general_policy}</StyledText>
          </StyledScrollView>
        </StyledView>
      </BottomSheet>
    </StyledScreen>
  )
}

export default BookingDetailScreen
