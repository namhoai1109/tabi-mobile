import Skeleton from "app/components/core/Skeleton"
import { colors } from "app/theme"
import { styled } from "nativewind"
import React from "react"
import { Dimensions, View, ViewStyle, StyleSheet } from "react-native"

const { width } = Dimensions.get("screen")

const StyledView = styled(View)

const SkeletonHotelList = () => {
  const renderSkeletonCards = () => {
    const skeletonCards = []
    for (let i = 0; i < 10; i++) {
      skeletonCards.push(
        <StyledView
          key={String("skeleton_hotel_card_" + i)}
          style={$scrollViewContentContainerStyle}
        >
          <StyledView className="flex items-center justify-center mb-4">
            <StyledView style={styles.card}>
              <Skeleton width="100%" height={150} borderRadius={15} />
              <StyledView style={{ marginTop: 10 }}>
                <StyledView
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <StyledView className="max-w-[300px] flex flex-col items-start justify-center">
                    <Skeleton width="100%" height={20} borderRadius={5} />
                    <StyledView className="flex-row items-start space-x-1 mt-2">
                      <Skeleton width="50%" height={20} borderRadius={5} />
                    </StyledView>
                  </StyledView>
                  <StyledView className="flex flex-col items-end justify-center gap-2">
                    <StyledView className="flex-row items-end">
                      <Skeleton width={100} height={20} borderRadius={5} />
                    </StyledView>
                    <StyledView className="flex-row items-end">
                      <Skeleton width={150} height={20} borderRadius={5} />
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>,
      )
    }
    return skeletonCards
  }

  return <>{renderSkeletonCards()}</>
}

const $scrollViewContentContainerStyle: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: colors.palette.baseBgLight,
}

const styles = StyleSheet.create({
  card: {
    height: 250,
    backgroundColor: colors.palette.light,
    elevation: 10,
    width: width - 40,
    shadowColor: colors.palette.neutral600,
    padding: 15,
    borderRadius: 20,
  },
})

export default SkeletonHotelList
