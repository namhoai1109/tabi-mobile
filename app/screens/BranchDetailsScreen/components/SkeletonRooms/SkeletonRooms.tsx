import { Icon, Text } from "app/components/core"
import Skeleton from "app/components/core/Skeleton"
import { colors } from "app/theme"
import { styled } from "nativewind"
import React, { useRef, useState } from "react"
import { Dimensions, View, StyleSheet, TouchableOpacity, Animated } from "react-native"

const { width } = Dimensions.get("screen")
const cardWidth = width / 1.8

const StyledAnimatedFlatlist = styled(Animated.FlatList)
const StyledAnimatedView = styled(Animated.View)
const StyledView = styled(View)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface ISkeletonRoomsProps {}

interface ISkeletonRoomProps {
  index: number
}

const SkeletonRooms: React.FC<ISkeletonRoomsProps> = () => {
  const scrollX = useRef(new Animated.Value(0)).current

  const SkeletonCardRoom: React.FC<ISkeletonRoomProps> = ({ index }) => {
    return (
      <StyledTouchableOpacity activeOpacity={1} key={index}>
        <StyledAnimatedView style={{ ...style.card }}>
          <StyledAnimatedView />
          <Skeleton height={200} width="100%" borderRadius={15} />
          <StyledView style={style.cardDetails}>
            <StyledView style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <StyledView>
                <Skeleton width={140} height={20} borderRadius={15} />
                <StyledView className="flex flex-col items-start justify-start">
                  <StyledView className="flex-row items-start">
                    <StyledText className="text-gray-400 text-xs line-through mt-1">
                      <Skeleton width={90} height={15} borderRadius={15} />
                    </StyledText>
                  </StyledView>
                  <StyledView className="flex-row items-start">
                    <StyledText className="text-primary-dominant font-semibold">
                      <Skeleton width={120} height={17} borderRadius={15} />
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
              <StyledIcon icon="bookmark" size={26} color={colors.palette.primaryDominantLight} />
            </StyledView>
            <StyledView
              style={{ flexDirection: "row", justifyContent: "flex-start", marginTop: 2 }}
            >
              <StyledView style={{ flexDirection: "row" }}>
                <Skeleton width={75} height={15} borderRadius={15} />
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledAnimatedView>
      </StyledTouchableOpacity>
    )
  }

  return (
    <StyledAnimatedFlatlist
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      })}
      horizontal
      data={[0, 1, 2]}
      contentContainerStyle={{
        paddingVertical: 30,
        paddingLeft: 20,
        paddingRight: cardWidth / 2 - 40,
      }}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }: any) => <SkeletonCardRoom index={item} />}
      snapToInterval={cardWidth}
    />
  )
}

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: colors.palette.light,
    marginTop: 15,
    marginLeft: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 30,
  },
  categoryListText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  card: {
    height: 280,
    width: cardWidth,
    elevation: 15,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: colors.palette.light,
  },
  cardImage: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  priceTag: {
    height: 60,
    width: 80,
    backgroundColor: colors.palette.primaryDominantLighter,
    position: "absolute",
    zIndex: 1,
    right: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardDetails: {
    height: 120,
    borderRadius: 15,
    backgroundColor: colors.palette.light,
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
  },
  toproomCard: {
    height: 120,
    width: 120,
    backgroundColor: colors.palette.light,
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  toproomCardImage: {
    height: 80,
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
})

export default SkeletonRooms
