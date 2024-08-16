import Skeleton from "app/components/core/Skeleton"
import { colors, rounded, spacing } from "app/theme"
import { styled } from "nativewind"
import React from "react"
import { Pressable, View, ViewStyle } from "react-native"

const StyledPressable = styled(Pressable)
const StyledView = styled(View)
const IMAGE_HEIGHT = 132

function BookingItemSkeleton() {
  return (
    <StyledPressable className="flex items-center justify-center pt-2 px-4 mb-3 bg-white">
      <StyledView className="rounded-xl w-full relative p-4" style={$shadowStyle}>
        <Skeleton width="100%" height={IMAGE_HEIGHT} borderRadius={rounded.r3} />
        <StyledView className="mt-2">
          <Skeleton
            width={160}
            height={28}
            borderRadius={rounded.r3}
            style={{
              marginBottom: spacing.s2,
            }}
          />
          <Skeleton
            width={240}
            height={20}
            borderRadius={rounded.r3}
            style={{
              marginBottom: spacing.s2,
            }}
          />
          <Skeleton width={60} height={20} borderRadius={rounded.r3} />

          <StyledView className="w-full h-[2px] rounded bg-neutral-200 my-3" />
          <StyledView className="flex flex-row justify-center items-start">
            <StyledView className="w-[20%]">
              <Skeleton
                width={40}
                height={20}
                borderRadius={rounded.r3}
                style={{
                  marginBottom: spacing.s2,
                }}
              />
              <Skeleton
                width={60}
                height={24}
                borderRadius={rounded.r3}
                style={{
                  marginBottom: spacing.s2,
                }}
              />
              <Skeleton
                width={40}
                height={20}
                borderRadius={rounded.r3}
                style={{
                  marginBottom: spacing.s2,
                }}
              />
            </StyledView>
            <StyledView className="w-[2px] h-full rounded bg-neutral-200 mx-3" />
            <StyledView className="grow">
              <Skeleton
                width={120}
                height={20}
                borderRadius={rounded.r3}
                style={{
                  marginBottom: spacing.s2,
                }}
              />
              <Skeleton
                width={110}
                height={20}
                borderRadius={rounded.r3}
                style={{
                  marginBottom: spacing.s2,
                }}
              />
              <Skeleton
                width={100}
                height={20}
                borderRadius={rounded.r3}
                style={{
                  marginBottom: spacing.s2,
                }}
              />
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

export default BookingItemSkeleton
