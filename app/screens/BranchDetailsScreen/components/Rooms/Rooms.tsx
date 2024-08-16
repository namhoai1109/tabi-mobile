import { Text } from "app/components/core"
import { styled } from "nativewind"
import { Animated, Dimensions, View } from "react-native"
import CardRoom from "./CardRoom"
import { useRef, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { translate } from "app/i18n"
import SkeletonRooms from "../SkeletonRooms"

const StyledView = styled(View)
const StyledAnimatedFlatlist = styled(Animated.FlatList)
const StyledText = styled(Text)

const { width } = Dimensions.get("screen")
const cardWidth = width / 1.8

interface IRoomsProps {
  dataSourceCords: {
    [key: string]: number
  }
  setDataSourceCords: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number
    }>
  >
  branchDetails: TBranchDetailsData | undefined
  rooms: TRoomResponse[]
  handleEndReached: () => void
  isFetching: boolean
}

const Rooms: React.FC<IRoomsProps> = ({
  dataSourceCords,
  setDataSourceCords,
  branchDetails,
  rooms,
  handleEndReached,
  isFetching,
}) => {
  const navigation = useNavigation()

  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current

  return (
    <StyledView
      key={"Rooms"}
      className="w-full"
      onLayout={(event) => {
        const layout = event.nativeEvent.layout
        dataSourceCords["Rooms"] = layout.y + 232
        setDataSourceCords(dataSourceCords)
      }}
    >
      <StyledText className="text-lg font-bold px-6">
        {translate("branchDetailsScreen.scrollToItems.Rooms")}
      </StyledText>
      <StyledView>
        {isFetching ? (
          <SkeletonRooms />
        ) : (
          <StyledAnimatedFlatlist
            onMomentumScrollEnd={(e) => {
              setActiveCardIndex(Math.round(e.nativeEvent.contentOffset.x / cardWidth))
            }}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: true,
            })}
            horizontal
            data={rooms || []}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            contentContainerStyle={{
              paddingVertical: 30,
              paddingLeft: 20,
              paddingRight: cardWidth / 2 - 40,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }: any) => (
              <CardRoom
                branchDetails={branchDetails}
                room={item as TRoomResponse}
                navigation={navigation}
                index={index}
                activeCardIndex={activeCardIndex}
                scrollX={scrollX}
              />
            )}
            snapToInterval={cardWidth}
          />
        )}
      </StyledView>
    </StyledView>
  )
}

export default Rooms
