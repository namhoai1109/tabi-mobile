import { ActivityIndicator } from "@ant-design/react-native"
import { Text, TextField } from "app/components/core"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import { useRateBranch } from "app/services/branch/services"
import { colors, spacing } from "app/theme"
import { styled } from "nativewind"
import { useState } from "react"
import { Dimensions, Pressable, View } from "react-native"
import { IconFill } from "@ant-design/icons-react-native"
import { TxKeyPath } from "app/i18n"

interface ISendingReviewBS {
  bottomSheetRef: React.RefObject<TBottomSheet>
  roomId: number
  bookingId: number
  branchId: number
  onSuccess: () => void
}
const StyledView = styled(View)
const StyledText = styled(Text)
const StyledPressable = styled(Pressable)
const StyledIconFill = styled(IconFill)

const getRatingLabel = (rating: number): TxKeyPath => {
  switch (rating) {
    case 1:
      return "rating.bad"
    case 2:
      return "rating.unsatisfied"
    case 3:
      return "rating.average"
    case 4:
      return "rating.good"
    case 5:
      return "rating.excellent"
    default:
      return "" as TxKeyPath
  }
}

function SendingReviewBS({
  bottomSheetRef,
  roomId,
  bookingId,
  branchId,
  onSuccess,
}: ISendingReviewBS) {
  const { height } = Dimensions.get("screen")
  const { mutate, isLoading } = useRateBranch(branchId)
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(5)

  return (
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
          <StyledText preset="subheading" className="mb-2" tx="bookingDetailsScreen.review" />
          <StyledView className="flex flex-row items-center justify-between px-4">
            <StyledView className="flex flex-row justify-center items-center gap-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((item) => {
                return (
                  <StyledPressable
                    key={item}
                    onPress={() => {
                      setRating(item)
                    }}
                  >
                    <StyledIconFill
                      name="star"
                      size={28}
                      style={{
                        color:
                          item <= rating
                            ? colors.palette.primaryDominant
                            : colors.palette.neutral300,
                      }}
                    />
                  </StyledPressable>
                )
              })}
            </StyledView>
            <StyledText tx={getRatingLabel(rating)} className="text-primary-dominant text-lg" />
          </StyledView>
          <TextField
            numberOfLines={8}
            containerStyle="bg-white"
            multiline
            placeholderTx="bookingDetailsScreen.reviewPlaceholder"
            value={review}
            onChangeText={(text) => setReview(text)}
          />
        </StyledView>
        <StyledPressable
          className="w-full bg-primary-dominant py-2 rounded-lg flex flex-row justify-center items-center mb-3"
          onPress={() => {
            if (review !== "") {
              mutate(
                {
                  room_id: roomId,
                  booking_id: bookingId,
                  comment: review,
                  rating,
                },
                {
                  onSuccess,
                },
              )
            }
            bottomSheetRef.current?.close()
          }}
          style={{
            backgroundColor:
              review === "" ? colors.palette.neutral300 : colors.palette.primaryDominant,
          }}
        >
          <StyledText className="text-white mr-2" tx="bookingDetailsScreen.send" />
          <ActivityIndicator animating={isLoading} color={colors.palette.neutral100} />
        </StyledPressable>
      </StyledView>
    </BottomSheet>
  )
}

export default SendingReviewBS
