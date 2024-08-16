import { ActivityIndicator } from "@ant-design/react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { CompositeNavigationProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BookingItem from "app/components/common/BookingItem"
import { Icon, Text } from "app/components/core"
import { TAppStackParamList } from "app/navigators"
import { TTabiTabParamList } from "app/navigators/TabiNavigator"
import { useGetBookingList } from "app/services/booking/services"
import { colors, spacing } from "app/theme"
import { styled } from "nativewind"
import { View } from "react-native"

const StyledView = styled(View)
const StyledText = styled(Text)

interface IBookingListProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TTabiTabParamList, "Booking", undefined>,
    NativeStackNavigationProp<TAppStackParamList, keyof TAppStackParamList, undefined>
  >
}

function BookingList({ navigation }: IBookingListProps) {
  const { data: bookingList, isLoading } = useGetBookingList()
  const loading = isLoading || bookingList === undefined

  if (loading) {
    return (
      <StyledView className="w-full flex justify-center mt-8">
        <ActivityIndicator animating={loading} color={colors.palette.primaryDominantLight} />
      </StyledView>
    )
  }

  if (bookingList.length === 0) {
    return (
      <StyledView className="w-full flex flex-col items-center justify-start mt-8">
        <Icon icon="emptyFolder" size={spacing.s18} />
        <StyledText className="text-center w-2/3" tx="bookingScreen.emptyData" />
      </StyledView>
    )
  }

  return bookingList.map((booking, index) => {
    const bookingData = booking.data
    return (
      <BookingItem
        key={index}
        data={bookingData}
        imageSource={{ uri: booking.file.get_url || "" }}
        onPress={() => {
          navigation.navigate("BookingDetailScreen", {
            data: booking,
          })
        }}
      />
    )
  })
}

export default BookingList
