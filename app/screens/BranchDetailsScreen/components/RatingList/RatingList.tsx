import { ScrollView, TouchableOpacity, View } from "react-native"
import React, { useRef } from "react"
import { styled } from "nativewind"
import { Icon, Text } from "app/components/core"
import { formatDateString } from "app/utils/formatDate"
import { getLocale } from "app/i18n"
import { IconFill } from "@ant-design/icons-react-native"
import { colors, spacing } from "app/theme"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"

interface IRatingListProps {
  dataSourceCords: {
    [key: string]: number
  }
  setDataSourceCords: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number
    }>
  >
  branchDetails: TBranchDetailsData | undefined
}

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)
const StyledIcon = styled(Icon)
const StyledIconFill = styled(IconFill)
const StyledTouchableOpacity = styled(TouchableOpacity)

function RatingList({ dataSourceCords, setDataSourceCords, branchDetails }: IRatingListProps) {
  const ratings = branchDetails?.ratings || []
  const isEn = getLocale() === "en-US"
  const bottomSheetRef = useRef<TBottomSheet>(null)
  const stars = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length

  return (
    <StyledView
      key={"Reviews"}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout
        dataSourceCords["Reviews"] = layout.y + 233
        setDataSourceCords(dataSourceCords)
      }}
    >
      <StyledView className="px-6 flex flex-row justify-between items-center">
        <StyledText
          className="text-lg font-bold mb-2"
          tx="branchDetailsScreen.scrollToItems.Reviews"
        />
        <StyledTouchableOpacity
          className="flex flex-row items-center"
          onPress={() => {
            bottomSheetRef.current?.open()
          }}
        >
          <StyledText
            className="text-neutral-600 leading-5 lowercase"
            tx="branchDetailsScreen.viewAll"
          />
          <StyledIcon color={colors.palette.neutral600} icon="caretRight" size={18} />
        </StyledTouchableOpacity>
      </StyledView>
      <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ratings.slice(0, 5).map((rating, index) => {
          return (
            <StyledView
              key={rating.id}
              className="flex items-start justify-center w-[240px] border border-neutral-200 rounded-lg p-2"
              style={{
                marginLeft: index === 0 ? spacing.s7 : spacing.s4,
                marginRight: index === 4 ? spacing.s7 : 0,
              }}
            >
              <StyledView className="flex flex-row items-start justify-start">
                <StyledView className="w-9 aspect-square rounded-full mr-2 mt-1 border border-neutral-300 flex items-center justify-center">
                  <StyledIconFill key={index} className="text-xl text-neutral-500" name="message" />
                </StyledView>
                <StyledView>
                  <StyledText className="text-sm">{rating.username}</StyledText>
                  <StyledText className="text-xs text-neutral-500">
                    {formatDateString(new Date(rating.created_at), isEn)}
                  </StyledText>
                  <StyledView className="flex flex-row mt-1">
                    {Array(rating.rating)
                      .fill(null)
                      .map((_, index) => {
                        return (
                          <StyledIconFill
                            key={index}
                            className="w-4 h-4 text-yellow-400"
                            name="star"
                          />
                        )
                      })}
                  </StyledView>
                </StyledView>
              </StyledView>
              <StyledText
                className="text-sm text-gray-700 mt-2"
                ellipsizeMode="tail"
                numberOfLines={3}
              >
                {rating.comment}
              </StyledText>
            </StyledView>
          )
        })}
      </StyledScrollView>
      <BottomSheet
        height={800}
        ref={bottomSheetRef}
        customStyles={{
          container: {
            borderTopLeftRadius: spacing.s6,
            borderTopRightRadius: spacing.s6,
          },
        }}
      >
        <StyledView>
          <StyledView className="flex flex-row items-center justify-start py-2 px-6 border-b border-neutral-300">
            <StyledIconFill className="text-neutral-900 mr-1" name="star"></StyledIconFill>
            <StyledText preset="subheading">{`${stars} · ${ratings.length} `}</StyledText>
            <StyledText preset="subheading" tx="branchDetailsScreen.scrollToItems.Reviews" />
          </StyledView>
          <StyledScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: 752,
              paddingLeft: spacing.s4,
              paddingRight: spacing.s4,
            }}
          >
            {ratings.map((rating, index) => {
              return (
                <StyledView key={rating.id} className="p-3">
                  <StyledView className="flex flex-row items-start justify-start">
                    <StyledView className="w-14 aspect-square rounded-full mr-2 mt-1 border border-neutral-300 flex items-center justify-center">
                      <StyledIconFill
                        key={index}
                        className="text-[28px] text-neutral-500"
                        name="message"
                      />
                    </StyledView>
                    <StyledView>
                      <StyledText className="text-base">{rating.username}</StyledText>
                      <StyledText className="text-sm text-neutral-500">
                        {formatDateString(new Date(rating.created_at), isEn)}
                      </StyledText>
                      <StyledView className="flex flex-row mt-1">
                        {Array(rating.rating)
                          .fill(null)
                          .map((_, index) => {
                            return (
                              <StyledIconFill
                                key={index}
                                className="w-4 h-4 text-yellow-400"
                                name="star"
                              />
                            )
                          })}
                      </StyledView>
                    </StyledView>
                  </StyledView>
                  <StyledText className="text-sm text-gray-700 mt-2">{rating.comment}</StyledText>
                </StyledView>
              )
            })}
          </StyledScrollView>
        </StyledView>
      </BottomSheet>
    </StyledView>
  )
}

export default RatingList
