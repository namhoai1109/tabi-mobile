import { Button } from "@ant-design/react-native"
import { Header, Screen, Text } from "app/components/core"
import { isValidInfoForBookingReviewScreen, useReservation } from "app/hooks/useReservation"
import { translate } from "app/i18n"
import { TAppStackScreenProps } from "app/navigators"
import {
  CANCEL_URL,
  ON_SITE_PAYMENT_METHOD,
  PAYPAL_PAYMENT_METHOD,
  RETURN_URL,
  useCapturePayment,
  useCreatePayment,
} from "app/services/payment/services"
import { colors, rounded, spacing } from "app/theme"
import { formatCurrency } from "app/utils/formatCurrency"
import {
  getTimeHourAndMinute,
  quantityDateBetween2Date,
  getDate,
  formatDateStringForCalendarPickerPlaceholder,
} from "app/utils/formatDate"
import AnimatedLottieView from "lottie-react-native"
import { styled } from "nativewind"
import queryString from "query-string"
import React, { FC, useEffect, useMemo, useState } from "react"
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import WebView, { WebViewNavigation } from "react-native-webview"
import { getLocale } from "app/i18n"
import { useGetSearchState } from "app/hooks/useSearch"
import { keyBooking, useCreateBooking } from "app/services/booking/services"
import { useQueryClient } from "react-query"

const StyledView = styled(View)
const StyledScrollView = styled(ScrollView)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledButton = styled(Button)
const lottiesCheck = require("../../../assets/lotties/check.json")
const lottiesCross = require("../../../assets/lotties/cross.json")
const ON_CASH = "ON_CASH"
interface ICheckBoxIconProps {
  checked?: boolean
}

const CheckBoxIcon = ({ checked = false }: ICheckBoxIconProps) => {
  const animation = useMemo(() => new Animated.Value(0), [])

  const animate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 8],
  })

  useEffect(() => {
    if (checked) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }, [checked])

  const $style: ViewStyle = {
    borderRadius: rounded.full,
    backgroundColor: "white",
  }

  return (
    <StyledView
      className="flex justify-center items-center w-5 h-5 rounded-full"
      style={{
        backgroundColor: checked ? colors.palette.primaryDominant : colors.palette.neutral300,
      }}
    >
      <Animated.View
        style={{
          ...$style,
          width: animate,
          height: animate,
        }}
      />
    </StyledView>
  )
}

const getMessage = (approveLink: string) => {
  switch (approveLink) {
    case CANCEL_URL:
      return "bookingReviewScreen.paymentFailed"
    case RETURN_URL:
      return "bookingReviewScreen.paymentSuccess"
    case ON_CASH:
      return "bookingReviewScreen.reservationSuccess"
    default:
      return "bookingReviewScreen.reservationFailed"
  }
}

interface IBookingReviewScreenProps extends TAppStackScreenProps<"BookingReview"> {}

const getDateForRequest = (date: string, time: string) => {
  return `${getDate(date)}T${getTimeHourAndMinute(time)}:00Z`
}

const BookingReviewScreen: FC<IBookingReviewScreenProps> = function BookingReviewScreen({
  navigation,
}) {
  if (!isValidInfoForBookingReviewScreen()) {
    navigation.goBack()
  }
  const locale = getLocale()
  const isEn = locale === "en-US"
  const { width, height } = Dimensions.get("screen")
  const wImage = (width * 44) / 100
  const hImage = (wImage * 68) / 100
  const [isPaypal, setIsPaypal] = useState(false)
  const { bottom, top } = useSafeAreaInsets()
  const { branch, room, roomImages, me, checkInDate, checkOutDate } = useReservation()
  const [showModal, setShowModal] = useState(false)
  const { roomTotals } = useGetSearchState()
  const [webStateURL, setWebStateURL] = useState("")
  const queryClient = useQueryClient()
  const hasPaypal = branch.has_paypal

  useEffect(() => {
    if (!hasPaypal) {
      setIsPaypal(false)
    }
  }, [hasPaypal])

  const nightQuantity = quantityDateBetween2Date(checkInDate.toString(), checkOutDate.toString())
  const [reservationStatus, setReservationStatus] = useState("")
  const hasDiscount =
    (isPaypal && room.data.online_method_reduction !== 0) ||
    (!isPaypal && room.data.on_cash_method_reduction !== 0)

  let total = room.data.current_price * nightQuantity * roomTotals
  if (hasDiscount) {
    if (isPaypal) {
      total -= total * room.data.online_method_reduction
    } else {
      total -= total * room.data.on_cash_method_reduction
    }
  }
  const totalPrice = formatCurrency(total)

  const { mutate: createPaymentMutation, isLoading: isLoadingPaymentCreation } = useCreatePayment(
    (resp) => {
      setReservationStatus(resp.data.approve_link)
      setShowModal(true)
    },
  )

  const { mutate: capturePaymentMutation } = useCapturePayment()
  const { mutate: createBookingMutation, isLoading: isLoadingBookingCreation } = useCreateBooking()

  useEffect(() => {
    if (webStateURL === "") return
    const urlValues = queryString.parseUrl(webStateURL)
    const { token } = urlValues.query
    if (token !== "") {
      capturePaymentMutation(
        {
          orderID: token as string,
          data: {
            room_id: room.data.id,
            check_in_date: getDateForRequest(
              checkInDate.toString(),
              room.data.room_type.check_in_time,
            ),
            check_out_date: getDateForRequest(
              checkOutDate.toString(),
              room.data.room_type.check_out_time,
            ),
            payment_method: isPaypal ? PAYPAL_PAYMENT_METHOD : ON_SITE_PAYMENT_METHOD,
            total_price: total,
            quantity: roomTotals,
          } as TCapturePaymentRequest,
        },
        {
          onSuccess: () => {
            setReservationStatus(RETURN_URL)
          },
          onError: () => {
            setReservationStatus(CANCEL_URL)
          },
        },
      )
    }
  }, [webStateURL])

  const onPressBooking = () => {
    if (isPaypal) {
      createPaymentMutation({
        room_id: room.data.id,
        quantity: roomTotals,
        price: total,
      })
    } else {
      createBookingMutation(
        {
          room_id: room.data.id,
          check_in_date: getDateForRequest(
            checkInDate.toString(),
            room.data.room_type.check_in_time,
          ),
          check_out_date: getDateForRequest(
            checkOutDate.toString(),
            room.data.room_type.check_out_time,
          ),
          payment_method: ON_SITE_PAYMENT_METHOD,
          total_price: total,
          quantity: roomTotals,
          note: "",
        },
        {
          onSuccess: () => {
            setShowModal(true)
            setReservationStatus(ON_CASH)
          },
        },
      )
    }
  }

  const onUrlChange = (webviewState: WebViewNavigation) => {
    if (webviewState.url.includes(CANCEL_URL)) {
      setReservationStatus(CANCEL_URL)
      return
    }

    if (webviewState.url.includes(RETURN_URL)) {
      setWebStateURL(webviewState.url)
      setReservationStatus(RETURN_URL)
      return
    }
  }

  const isValidApproveLink =
    reservationStatus !== "" &&
    reservationStatus !== CANCEL_URL &&
    reservationStatus !== RETURN_URL &&
    reservationStatus !== ON_CASH

  return (
    <Screen preset="fixed">
      <Header
        titleTx="bookingReviewScreen.bookingReview"
        leftIcon="back"
        onLeftPress={() => {
          navigation.goBack()
        }}
        containerStyle={$header}
        style={{
          height: spacing.s11,
        }}
      />
      <StyledScrollView
        className="w-full bg-neutral-100 p-2 pb-0"
        style={{
          height: height - top - bottom - spacing.s11,
        }}
      >
        <StyledView className="bg-white p-2 mb-2 rounded-xl flex flex-row">
          <StyledImage
            source={{ uri: roomImages[0]?.get_url }}
            className="object-cover rounded-lg"
            style={{
              width: wImage,
              height: hImage,
            }}
          />
          <StyledView
            className="px-2"
            style={{
              width: wImage + 20,
            }}
          >
            <StyledText numberOfLines={2} size="xs">
              {branch.branch_name}
            </StyledText>
            <StyledText numberOfLines={2} preset="semibold">
              {room.data.room_name}
            </StyledText>
            <StyledText size="xs" numberOfLines={2}>
              {branch.district}, {branch.province_city}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText
          preset="subheading"
          className="ml-2 mb-1 mt-2"
          tx="bookingReviewScreen.yourTrip"
        />
        <StyledView className="bg-white py-4 mb-2 px-2 rounded-xl">
          <StyledView className="flex flex-row">
            <StyledText preset="semibold" className="w-[40%]" tx="bookingReviewScreen.checkIn" />
            <StyledText size="xs">
              {formatDateStringForCalendarPickerPlaceholder(new Date(checkInDate), isEn)} (
              {getTimeHourAndMinute(room.data.room_type.check_in_time)})
            </StyledText>
          </StyledView>
          <StyledView className="flex flex-row">
            <StyledText preset="semibold" className="w-[40%]" tx="bookingReviewScreen.checkOut" />
            <StyledText size="xs">
              {formatDateStringForCalendarPickerPlaceholder(new Date(checkOutDate), isEn)} (
              {getTimeHourAndMinute(room.data.room_type.check_out_time)})
            </StyledText>
          </StyledView>
          <StyledView className="flex flex-row">
            <StyledText preset="semibold" className="w-[40%]" tx="bookingReviewScreen.guest" />
            <StyledText size="xs">
              {room.data.max_occupancy * roomTotals} {translate("bookingReviewScreen.guestUnit")}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText
          preset="subheading"
          className="ml-2 mb-1 mt-2"
          tx="bookingReviewScreen.contactDetails"
        />
        <StyledView className="bg-white py-4 mb-2 px-2 rounded-xl">
          <StyledView className="flex flex-row">
            <StyledText
              preset="semibold"
              className="w-[40%]"
              tx="bookingReviewScreen.contactName"
            />
            <StyledText size="xs">
              {me.first_name} {me.last_name}
            </StyledText>
          </StyledView>
          <StyledView className="flex flex-row">
            <StyledText
              preset="semibold"
              className="w-[40%]"
              tx="bookingReviewScreen.phoneNumber"
            />
            <StyledText size="xs">{me.phone}</StyledText>
          </StyledView>
          <StyledView className="flex flex-row">
            <StyledText preset="semibold" className="w-[40%]" tx="bookingReviewScreen.email" />
            <StyledText size="xs">{me.email}</StyledText>
          </StyledView>
        </StyledView>

        <StyledText
          preset="subheading"
          className="ml-2 mb-1 mt-2"
          tx="bookingReviewScreen.paymentMethod"
        />
        <StyledView className="bg-white py-4 mb-2 px-2 rounded-xl">
          <StyledTouchableOpacity
            activeOpacity={1}
            className="flex flex-row items-center p-2 pl-0"
            onPress={() => {
              if (hasPaypal) setIsPaypal(false)
            }}
          >
            <CheckBoxIcon checked={!isPaypal} />
            <StyledView className="ml-4">
              <StyledText size="xs" preset="semibold" tx="bookingReviewScreen.payAtHotel" />
              <StyledText size="xs" tx="bookingReviewScreen.payAtHotelDescription" />
              {room.data.on_cash_method_reduction !== 0 && (
                <StyledText size="xs">
                  {translate("bookingReviewScreen.totalPriceDiscount")}{" "}
                  {room.data.on_cash_method_reduction * 100}%
                </StyledText>
              )}
            </StyledView>
          </StyledTouchableOpacity>
          {hasPaypal && (
            <>
              <StyledView className="h-[1px] w-full bg-neutral-200 my-2" />
              <StyledTouchableOpacity
                activeOpacity={1}
                className="flex flex-row items-center p-2 pl-0"
                onPress={() => {
                  setIsPaypal(true)
                }}
              >
                <CheckBoxIcon checked={isPaypal} />
                <StyledView className="ml-4">
                  <StyledText size="xs" preset="semibold" tx="bookingReviewScreen.payViaPaypal" />
                  <StyledText size="xs" tx="bookingReviewScreen.payViaPaypalDescription" />
                  {room.data.online_method_reduction !== 0 && (
                    <StyledText size="xs">
                      {translate("bookingReviewScreen.totalPriceDiscount")}{" "}
                      {room.data.online_method_reduction * 100}%
                    </StyledText>
                  )}
                </StyledView>
              </StyledTouchableOpacity>
            </>
          )}
        </StyledView>

        <StyledText
          preset="subheading"
          className="ml-2 mb-1 mt-2"
          tx="bookingReviewScreen.totalPrice"
        />
        <StyledView className="bg-white py-4 px-2 rounded-xl">
          <StyledView className="flex flex-row items-center justify-between">
            <StyledText
              preset="semibold"
              tx={isPaypal ? "bookingReviewScreen.payViaPaypal" : "bookingReviewScreen.payAtHotel"}
            />
            <StyledText
              preset="semibold"
              style={{
                color: colors.palette.primaryDominant,
              }}
            >
              {totalPrice} VND
            </StyledText>
          </StyledView>
          <StyledView className="h-[1px] w-full bg-neutral-200 my-2" />
          <StyledView className="flex flex-row items-center justify-between">
            <StyledText preset="semibold" size="xs" tx="bookingReviewScreen.roomPrice" />
            <StyledText size="xs">{formatCurrency(room.data.current_price)} VND</StyledText>
          </StyledView>
          <StyledView className="flex flex-row items-center justify-between">
            <StyledText preset="semibold" size="xs" tx="bookingReviewScreen.stayFor" />
            <StyledText size="xs">
              {nightQuantity} {translate("bookingReviewScreen.nightUnit")}
            </StyledText>
          </StyledView>
          <StyledView className="flex flex-row items-center justify-between">
            <StyledText preset="semibold" size="xs" tx="bookingReviewScreen.quantity" />
            <StyledText size="xs">
              {roomTotals} {translate("bookingReviewScreen.roomUnit")}
            </StyledText>
          </StyledView>
          {hasDiscount && (
            <StyledView className="flex flex-row items-center justify-between">
              <StyledText preset="semibold" size="xs" tx="bookingReviewScreen.discount" />
              <StyledText size="xs">
                {isPaypal
                  ? room.data.online_method_reduction * 100
                  : room.data.on_cash_method_reduction * 100}
                %
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        <StyledButton
          loading={isLoadingPaymentCreation || (!isPaypal && isLoadingBookingCreation)}
          type="primary"
          className="mt-4"
          onPress={onPressBooking}
        >
          {translate(isPaypal ? "bookingReviewScreen.payViaPaypal" : "bookingReviewScreen.reserve")}
        </StyledButton>
        <StyledView
          className="w-full"
          style={{
            height: bottom,
          }}
        />
      </StyledScrollView>
      <Modal visible={showModal}>
        {isValidApproveLink ? (
          <StyledView className="flex-1">
            <WebView
              originWhitelist={["*"]}
              source={{ uri: reservationStatus }}
              onNavigationStateChange={onUrlChange}
            />
          </StyledView>
        ) : (
          <StyledView className="flex-1 bg-white flex justify-center items-center">
            <AnimatedLottieView
              source={reservationStatus === CANCEL_URL ? lottiesCross : lottiesCheck}
              autoPlay
              loop={false}
              style={$lottieStyle}
              onAnimationFinish={() => {
                queryClient.invalidateQueries(keyBooking.BOOKING_LIST)
                navigation.navigate("Tabi", {
                  screen: "Home",
                })
              }}
            />
            <StyledText
              preset="subheading"
              tx={getMessage(reservationStatus)}
              style={{
                color: colors.palette.primaryDominant,
              }}
            />
          </StyledView>
        )}
      </Modal>
    </Screen>
  )
}

const $header: ViewStyle = {
  borderBottomWidth: 2,
  borderBottomColor: colors.palette.neutral200,
}

const $lottieStyle: ViewStyle = {
  width: 80,
  height: 80,
}

export default BookingReviewScreen
