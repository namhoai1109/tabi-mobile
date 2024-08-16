import { Icon, Text } from "app/components/core"
import { styled } from "nativewind"
import { colors } from "app/theme/colors"
import { Dimensions, TouchableOpacity, Animated, View, Image } from "react-native"
import { StyleSheet } from "react-native"
import { TReservationState, setReservation } from "app/hooks/useReservation"
import { useGetSearchState } from "app/hooks/useSearch"

const StyledAnimatedView = styled(Animated.View)
const StyledView = styled(View)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

const { width } = Dimensions.get("screen")
const cardWidth = width / 1.8

const me: TMeResponse = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  dob: "2000-01-01",
  email: "john@gmail.com",
  phone: "0123123123",
  username: "john_doe",
}

interface ICardRoomProps {
  branchDetails: TBranchDetailsData | undefined
  room: TRoomResponse
  navigation: any
  index: number
  activeCardIndex: number
  scrollX: Animated.Value
}

const CardRoom: React.FC<ICardRoomProps> = ({
  branchDetails,
  room,
  navigation,
  index,
  activeCardIndex,
  scrollX,
}) => {
  const searchState = useGetSearchState()
  const inputRange = [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth]
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 0, 0.7],
  })
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
  })
  return (
    <StyledTouchableOpacity
      disabled={activeCardIndex != index}
      activeOpacity={1}
      onPress={() => {
        setReservation({
          branch: branchDetails,
          room,
          me,
          roomImages: room.files,
          checkInDate: searchState.startDate,
          checkOutDate: searchState.endDate,
        } as TReservationState)
        navigation.navigate("RoomDetail")
      }}
    >
      <StyledAnimatedView style={{ ...style.card, transform: [{ scale }] }}>
        <StyledAnimatedView style={{ ...style.cardOverLay, opacity }} />
        <Image
          source={
            room?.files[0]?.get_url
              ? { uri: room.files[0].get_url }
              : require("../../../../../../assets/images/no_image.jpg")
          }
          style={style.cardImage}
        />
        <StyledView style={style.cardDetails}>
          <StyledView style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <StyledView>
              <StyledText style={{ fontWeight: "bold", fontSize: 17 }}>
                {room.data.room_name}
              </StyledText>
              <StyledView className="flex flex-col items-start justify-start">
                <StyledView className="flex-row items-start">
                  <StyledText className="text-gray-400 text-xs line-through">
                    {room.data.max_price} VND
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row items-start">
                  <StyledText className="text-primary-dominant font-semibold">
                    {room.data.current_price} VND
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledAnimatedView>
    </StyledTouchableOpacity>
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
    height: 260,
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
    height: 100,
    borderRadius: 15,
    backgroundColor: colors.palette.light,
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
  },
  cardOverLay: {
    height: 280,
    backgroundColor: colors.palette.light,
    position: "absolute",
    zIndex: 100,
    width: cardWidth,
    borderRadius: 15,
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

export default CardRoom
