import { ActivityIndicator } from "@ant-design/react-native"
import { Header, Icon, Screen, Text, TextField } from "app/components/core"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import { TAppStackScreenProps } from "app/navigators"
import { bookingStatus, keyBooking, useCancelBooking } from "app/services/booking/services"
import { ON_SITE_PAYMENT_METHOD } from "app/services/payment/services"
import { colors, spacing } from "app/theme"
import { styled } from "nativewind"
import { useRef, useState } from "react"
import { Dimensions, Pressable, View } from "react-native"
import { useQueryClient } from "react-query"

interface THelpScreenProps extends TAppStackScreenProps<"HelpScreen"> {}

const StyledScreen = styled(Screen)
const StyledHeader = styled(Header)
const StyledPressable = styled(Pressable)
const StyledText = styled(Text)
const StyledView = styled(View)

function HelpScreen({ navigation, route }: THelpScreenProps) {
  const { height } = Dimensions.get("window")
  const { bookingID, status, paymentMethod } = route.params
  const bottomSheetRef = useRef<TBottomSheet>(null)
  const [reason, setReason] = useState("")
  const { mutate, isLoading } = useCancelBooking()
  const queryClient = useQueryClient()

  const canCancel =
    (status === bookingStatus.Pending || status === bookingStatus.Approved) &&
    paymentMethod === ON_SITE_PAYMENT_METHOD

  return (
    <StyledScreen preset="fixed" safeAreaEdges={["bottom"]} className="bg-white">
      <StyledHeader
        titleTx="bookingDetailsScreen.help"
        leftIcon="back"
        className="border-b-[2px] mb-2"
        style={{
          height: spacing.s11,
          borderBottomColor: colors.palette.neutral200,
        }}
        onLeftPress={() => {
          navigation.goBack()
        }}
      />
      {canCancel && (
        <StyledPressable
          className=" flex flex-row items-center justify-between py-2 mx-4 border-b-[2px] border-neutral-100 mb-2"
          onPress={() => {
            bottomSheetRef.current?.open()
          }}
        >
          <StyledView className="flex flex-row items-center">
            <Icon icon="cancel" size={18} color={colors.text} />
            <StyledText className="ml-2" tx="bookingDetailsScreen.cancelThisReservation" />
          </StyledView>
          <Icon icon="caretRight" color={colors.text} />
        </StyledPressable>
      )}
      <StyledPressable className=" flex flex-row items-center justify-between py-2 mx-4 border-b-[2px] border-neutral-100">
        <StyledView className="flex flex-row items-center">
          <Icon icon="support" size={18} color={colors.text} />
          <StyledText className="ml-2" tx="bookingDetailsScreen.contactUs" />
        </StyledView>
      </StyledPressable>

      <BottomSheet
        ref={bottomSheetRef}
        height={height * 0.4}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: spacing.s6,
            borderTopRightRadius: spacing.s6,
          },
        }}
      >
        <StyledView className="w-full h-full bg-white py-2 px-4 flex flex-col justify-between">
          <StyledView>
            <StyledText
              preset="subheading"
              className="mb-2"
              tx="bookingDetailsScreen.cancellationReason"
            />
            <TextField
              numberOfLines={8}
              containerStyle="bg-white"
              multiline
              placeholderTx="bookingDetailsScreen.cancellationReasonPlaceholder"
              value={reason}
              onChangeText={setReason}
            />
          </StyledView>
          <StyledPressable
            className="w-full bg-primary-dominant py-2 rounded-lg flex flex-row justify-center items-center mb-3"
            onPress={() => {
              if (reason !== "") {
                mutate(
                  { bookingID, reason },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries(keyBooking.BOOKING_LIST)
                      navigation.navigate("Tabi", {
                        screen: "Booking",
                      })
                    },
                  },
                )
                bottomSheetRef.current?.close()
              }
            }}
          >
            <StyledText className="text-white mr-2" tx="bookingDetailsScreen.send" />
            <ActivityIndicator animating={isLoading} color={colors.palette.neutral100} />
          </StyledPressable>
        </StyledView>
      </BottomSheet>
    </StyledScreen>
  )
}

export default HelpScreen
